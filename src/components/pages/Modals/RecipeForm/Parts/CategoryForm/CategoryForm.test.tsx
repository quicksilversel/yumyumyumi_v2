/* eslint-disable react/display-name */
import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, FormProvider } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { ThemeWrapper } from '@/test-utils/test-setup'
import { recipeFormSchema } from '@/types/recipe'
import { RECIPE_CATEGORY } from '@/utils/constants'

import { CategoryForm } from './CategoryForm'

// Mock the Select component to avoid ref issues
jest.mock('@/components/ui/Forms/Select', () => ({
  Select: React.forwardRef<HTMLSelectElement, any>(
    (
      {
        title,
        options,
        error,
        fullWidth, // Filter out non-DOM props
        height, // Filter out non-DOM props
        ...props
      },
      ref,
    ) => (
      <div>
        {title && <label htmlFor={props.id}>{title}</label>}
        <select
          ref={ref}
          {...props}
          aria-label={title || 'Category'}
          data-error={error}
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    ),
  ),
}))

// Wrapper component to provide form context
const FormWrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode
  defaultValues?: Partial<RecipeForm>
}) => {
  const methods = useForm<RecipeForm>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      category: 'Main Course',
      ...defaultValues,
    },
  })

  return (
    <ThemeWrapper>
      <FormProvider {...methods}>{children}</FormProvider>
    </ThemeWrapper>
  )
}

describe('CategoryForm', () => {
  const categories = Object.values(RECIPE_CATEGORY)

  it('renders the category select field', () => {
    render(
      <FormWrapper>
        <CategoryForm />
      </FormWrapper>,
    )

    const select = screen.getByLabelText(/category/i)
    expect(select).toBeInTheDocument()
    expect(select).toHaveAttribute('id', 'category')
  })

  it('displays all category options', () => {
    render(
      <FormWrapper>
        <CategoryForm />
      </FormWrapper>,
    )

    const select = screen.getByLabelText(/category/i)
    const options = select.querySelectorAll('option')

    // Check that all categories are present as options
    categories.forEach((category) => {
      const option = Array.from(options).find(
        (opt) => opt.textContent === category,
      )
      expect(option).toBeInTheDocument()
    })
  })

  it('has Main Course as default value', () => {
    render(
      <FormWrapper>
        <CategoryForm />
      </FormWrapper>,
    )

    const select = screen.getByLabelText(/category/i) as HTMLSelectElement
    expect(select.value).toBe('Main Course')
  })

  it('allows selecting a different category', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CategoryForm />
      </FormWrapper>,
    )

    const select = screen.getByLabelText(/category/i) as HTMLSelectElement

    // Change selection using fireEvent (more reliable for select elements)
    fireEvent.change(select, { target: { value: 'Dessert' } })
    expect(select.value).toBe('Dessert')

    fireEvent.change(select, { target: { value: 'Breakfast' } })
    expect(select.value).toBe('Breakfast')
  })

  it('maintains selected value after re-render', () => {
    const { rerender } = render(
      <FormWrapper defaultValues={{ category: 'Soup' }}>
        <CategoryForm />
      </FormWrapper>,
    )

    const select = screen.getByLabelText(/category/i) as HTMLSelectElement
    expect(select.value).toBe('Soup')

    // Re-render the component
    rerender(
      <FormWrapper defaultValues={{ category: 'Soup' }}>
        <CategoryForm />
      </FormWrapper>,
    )

    expect(select.value).toBe('Soup')
  })

  it('validates category selection', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    const TestForm = () => {
      const methods = useForm<RecipeForm>({
        resolver: zodResolver(recipeFormSchema),
        defaultValues: {
          title: 'Test Recipe',
          ingredients: [{ name: 'Test', amount: '1 cup' }],
          directions: [{ title: 'Step 1' }],
          category: 'Baking',
          cookTime: 30,
          servings: 4,
          isPublic: false,
        },
      })

      return (
        <ThemeWrapper>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <CategoryForm />
              <button type="submit">Submit</button>
            </form>
          </FormProvider>
        </ThemeWrapper>
      )
    }

    render(<TestForm />)

    const select = screen.getByLabelText(/category/i) as HTMLSelectElement
    expect(select.value).toBe('Baking')

    const submitButton = screen.getByText('Submit')
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      const [[formData]] = onSubmit.mock.calls
      expect(formData).toMatchObject({
        category: 'Baking',
      })
    })
  })

  it('handles rapid category changes', () => {
    render(
      <FormWrapper>
        <CategoryForm />
      </FormWrapper>,
    )

    const select = screen.getByLabelText(/category/i) as HTMLSelectElement

    // Rapidly change categories
    fireEvent.change(select, { target: { value: 'Appetizer' } })
    fireEvent.change(select, { target: { value: 'Dessert' } })
    fireEvent.change(select, { target: { value: 'Snack' } })
    fireEvent.change(select, { target: { value: 'Beverage' } })

    expect(select.value).toBe('Beverage')
  })

  it('preserves category when other form fields change', async () => {
    const user = userEvent.setup()
    const TestForm = () => {
      const methods = useForm<RecipeForm>({
        resolver: zodResolver(recipeFormSchema),
        defaultValues: {
          category: 'Salad',
          title: '',
        },
      })

      return (
        <ThemeWrapper>
          <FormProvider {...methods}>
            <CategoryForm />
            <input {...methods.register('title')} placeholder="Recipe title" />
          </FormProvider>
        </ThemeWrapper>
      )
    }

    render(<TestForm />)

    const select = screen.getByLabelText(/category/i) as HTMLSelectElement
    const titleInput = screen.getByPlaceholderText('Recipe title')

    expect(select.value).toBe('Salad')

    // Change another field
    await user.type(titleInput, 'My Recipe')

    // Category should remain unchanged
    expect(select.value).toBe('Salad')
  })

  it('integrates with form submission', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    const TestForm = () => {
      const methods = useForm<RecipeForm>({
        resolver: zodResolver(recipeFormSchema),
        defaultValues: {
          title: 'Test Recipe',
          ingredients: [{ name: 'Test', amount: '1 cup' }],
          directions: [{ title: 'Step 1' }],
          category: 'Main Course',
          cookTime: 30,
          servings: 4,
          isPublic: false,
        },
      })

      return (
        <ThemeWrapper>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <CategoryForm />
              <button type="submit">Submit</button>
            </form>
          </FormProvider>
        </ThemeWrapper>
      )
    }

    render(<TestForm />)

    const select = screen.getByLabelText(/category/i) as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'Soup' } })

    const submitButton = screen.getByText('Submit')
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      const [[formData]] = onSubmit.mock.calls
      expect(formData).toMatchObject({
        category: 'Soup',
      })
    })
  })

  it('displays categories with correct values', () => {
    render(
      <FormWrapper>
        <CategoryForm />
      </FormWrapper>,
    )

    const select = screen.getByLabelText(/category/i)
    const options = Array.from(select.querySelectorAll('option'))

    // Check that options have correct values
    expect(options).toHaveLength(categories.length)
    options.forEach((option, index) => {
      expect(option.textContent).toBe(categories[index])
      expect(option.getAttribute('value')).toBe(categories[index])
    })
  })
})
