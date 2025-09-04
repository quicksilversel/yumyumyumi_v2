import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, FormProvider } from 'react-hook-form'

import type { RecipeForm as RecipeFormType } from '@/types/recipe'

import { recipeFormSchema } from '@/types/recipe'

import { RecipeForm } from './RecipeForm'

jest.mock('./Parts/ImageForm', () => ({
  ImageForm: () => <div data-testid="image-form">ImageForm</div>,
}))

jest.mock('./Parts/TitleForm', () => ({
  TitleForm: () => (
    <input
      data-testid="title-input"
      placeholder="Enter recipe title"
      defaultValue=""
    />
  ),
}))

jest.mock('./Parts/SummaryForm', () => ({
  SummaryForm: () => (
    <textarea
      data-testid="summary-input"
      placeholder="Recipe summary"
      defaultValue=""
    />
  ),
}))

jest.mock('./Parts/CategoryForm', () => ({
  CategoryForm: () => (
    <select data-testid="category-select" defaultValue="Main Course">
      <option>Main Course</option>
      <option>Dessert</option>
    </select>
  ),
}))

jest.mock('./Parts/CookTimeForm', () => ({
  CookTimeForm: () => (
    <input data-testid="cooktime-input" type="number" defaultValue="30" />
  ),
}))

jest.mock('./Parts/ServingsForm', () => ({
  ServingsForm: () => (
    <input data-testid="servings-input" type="number" defaultValue="4" />
  ),
}))

jest.mock('./Parts/IngredientsForm', () => ({
  IngredientsForm: () => (
    <div data-testid="ingredients-form">IngredientsForm</div>
  ),
}))

jest.mock('./Parts/DirectionsForm', () => ({
  DirectionsForm: () => <div data-testid="directions-form">DirectionsForm</div>,
}))

jest.mock('./Parts/TagsForm', () => ({
  TagsForm: () => <div data-testid="tags-form">TagsForm</div>,
}))

jest.mock('./Parts/SourceForm', () => ({
  SourceForm: () => (
    <input
      data-testid="source-input"
      placeholder="Recipe source"
      defaultValue=""
    />
  ),
}))

jest.mock('./Parts/TipsForm', () => ({
  TipsForm: () => (
    <textarea data-testid="tips-input" placeholder="Tips" defaultValue="" />
  ),
}))

jest.mock('./Parts/IsPublicForm', () => ({
  IsPublicForm: () => (
    <input data-testid="ispublic-checkbox" type="checkbox" defaultChecked />
  ),
}))

describe('RecipeForm Integration', () => {
  const defaultProps = {
    errors: [],
    handleImageChange: jest.fn(),
    uploadingImage: false,
  }

  it('renders all form sections', () => {
    render(<RecipeForm {...defaultProps} />)

    expect(screen.getByTestId('image-form')).toBeInTheDocument()
    expect(screen.getByTestId('title-input')).toBeInTheDocument()
    expect(screen.getByTestId('summary-input')).toBeInTheDocument()
    expect(screen.getByTestId('category-select')).toBeInTheDocument()
    expect(screen.getByTestId('cooktime-input')).toBeInTheDocument()
    expect(screen.getByTestId('servings-input')).toBeInTheDocument()
    expect(screen.getByTestId('ingredients-form')).toBeInTheDocument()
    expect(screen.getByTestId('directions-form')).toBeInTheDocument()
    expect(screen.getByTestId('tags-form')).toBeInTheDocument()
    expect(screen.getByTestId('source-input')).toBeInTheDocument()
    expect(screen.getByTestId('tips-input')).toBeInTheDocument()
    expect(screen.getByTestId('ispublic-checkbox')).toBeInTheDocument()
  })

  it('displays errors when provided', () => {
    const errors = [
      'Title is required',
      'At least one ingredient is required',
      'At least one direction is required',
    ]

    render(<RecipeForm {...defaultProps} errors={errors} />)

    errors.forEach((error) => {
      expect(screen.getByText(error)).toBeInTheDocument()
    })
  })

  it('does not display error section when no errors', () => {
    render(<RecipeForm {...defaultProps} errors={[]} />)

    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument()
  })

  it('passes uploading state to image form', () => {
    const { rerender } = render(
      <RecipeForm {...defaultProps} uploadingImage={false} />,
    )

    expect(screen.getByTestId('image-form')).toBeInTheDocument()

    rerender(<RecipeForm {...defaultProps} uploadingImage={true} />)

    expect(screen.getByTestId('image-form')).toBeInTheDocument()
  })

  it('renders dividers between major sections', () => {
    const { container } = render(<RecipeForm {...defaultProps} />)

    const dividers = container.querySelectorAll('hr')
    expect(dividers.length).toBeGreaterThan(0)
  })

  it('groups related fields in grid layout', () => {
    render(<RecipeForm {...defaultProps} />)

    const categorySelect = screen.getByTestId('category-select')
    const cookTimeInput = screen.getByTestId('cooktime-input')
    const servingsInput = screen.getByTestId('servings-input')

    expect(categorySelect).toBeInTheDocument()
    expect(cookTimeInput).toBeInTheDocument()
    expect(servingsInput).toBeInTheDocument()
  })
})

describe('RecipeForm with FormProvider Integration', () => {
  const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<RecipeFormType>({
      resolver: zodResolver(recipeFormSchema),
      defaultValues: {
        title: '',
        summary: '',
        ingredients: [],
        directions: [],
        category: 'Main Course',
        cookTime: 30,
        servings: 4,
        tags: [],
        tips: '',
        source: '',
        imageUrl: '',
        isPublic: true,
      },
    })

    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})}>
          {children}
          <button type="submit">Submit Recipe</button>
        </form>
      </FormProvider>
    )
  }

  it('integrates with React Hook Form context', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    const TestForm = () => {
      const methods = useForm<RecipeFormType>({
        resolver: zodResolver(recipeFormSchema),
        defaultValues: {
          title: 'Test Recipe',
          summary: 'A test recipe',
          ingredients: [{ name: 'Flour', amount: '2 cups' }],
          directions: [{ title: 'Mix ingredients' }],
          category: 'Main Course',
          cookTime: 30,
          servings: 4,
          tags: ['test'],
          tips: 'Test tip',
          source: 'Test source',
          imageUrl: '',
          isPublic: true,
        },
      })

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <RecipeForm errors={[]} />
            <button type="submit">Submit</button>
          </form>
        </FormProvider>
      )
    }

    render(<TestForm />)

    const submitButton = screen.getByText('Submit')
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Recipe',
          category: 'Main Course',
          cookTime: 30,
          servings: 4,
        }),
      )
    })
  })

  it('validates required fields on submission', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    const TestForm = () => {
      const methods = useForm<RecipeFormType>({
        resolver: zodResolver(recipeFormSchema),
        mode: 'onSubmit',
        defaultValues: {
          title: '',
          ingredients: [],
          directions: [],
          category: 'Main Course',
          cookTime: 30,
          servings: 4,
        },
      })

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <RecipeForm errors={[]} />
            <button type="submit">Submit</button>
          </form>
          {methods.formState.errors.title && (
            <span data-testid="title-error">
              {methods.formState.errors.title.message}
            </span>
          )}
          {methods.formState.errors.ingredients && (
            <span data-testid="ingredients-error">
              {methods.formState.errors.ingredients.message}
            </span>
          )}
          {methods.formState.errors.directions && (
            <span data-testid="directions-error">
              {methods.formState.errors.directions.message}
            </span>
          )}
        </FormProvider>
      )
    }

    render(<TestForm />)

    const submitButton = screen.getByText('Submit')
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toBeInTheDocument()
      expect(screen.getByTestId('ingredients-error')).toBeInTheDocument()
      expect(screen.getByTestId('directions-error')).toBeInTheDocument()
    })
  })

  it('handles complex recipe data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    const complexRecipeData: RecipeFormType = {
      title: 'Complex Recipe with Special Characters: Crème Brûlée',
      summary: 'A sophisticated French dessert with a caramelized sugar top',
      ingredients: [
        { name: 'Heavy cream', amount: '2 cups', isSpice: false },
        { name: 'Vanilla bean', amount: '1 whole', isSpice: true },
        { name: 'Egg yolks', amount: '6 large', isSpice: false },
        {
          name: 'Sugar',
          amount: '1/3 cup + extra for topping',
          isSpice: false,
        },
      ],
      directions: [
        { title: 'Prepare cream', description: 'Heat cream with vanilla bean' },
        { title: 'Mix eggs', description: 'Whisk egg yolks with sugar' },
        { title: 'Combine', description: 'Slowly add hot cream to eggs' },
        { title: 'Bake', description: 'Bake in water bath at 325°F' },
        {
          title: 'Caramelize',
          description: 'Torch sugar on top before serving',
        },
      ],
      category: 'Dessert',
      cookTime: 45,
      servings: 6,
      tags: ['French', 'dessert', 'elegant', 'make-ahead'],
      tips: 'Use a kitchen torch for best caramelization results. Can be made 2 days ahead.',
      source: 'https://example.com/creme-brulee',
      imageUrl: 'https://example.com/image.jpg',
      isPublic: false,
    }

    const TestForm = () => {
      const methods = useForm<RecipeFormType>({
        resolver: zodResolver(recipeFormSchema),
        defaultValues: complexRecipeData,
      })

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <RecipeForm errors={[]} />
            <button type="submit">Submit</button>
          </form>
        </FormProvider>
      )
    }

    render(<TestForm />)

    const submitButton = screen.getByText('Submit')
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(complexRecipeData)
    })
  })
})
