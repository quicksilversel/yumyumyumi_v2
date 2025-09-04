/* eslint-disable react/display-name */
import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, FormProvider } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { ThemeWrapper } from '@/lib/jest/ThemeWrapper'
import { recipeFormSchema } from '@/types/recipe'

import { IngredientsForm } from './IngredientsForm'

// Mock MUI icons
jest.mock('@mui/icons-material/Add', () => ({
  __esModule: true,
  default: () => <span>Add Icon</span>,
}))

jest.mock('@mui/icons-material/Delete', () => ({
  __esModule: true,
  default: () => <span data-testid="DeleteIcon">Delete Icon</span>,
}))

// Mock all UI components
jest.mock('@/components/ui', () => ({
  Input: React.forwardRef<HTMLInputElement, any>(
    ({ error, ...props }: any, ref) => (
      <input ref={ref} {...props} data-error={error} />
    ),
  ),
  Button: ({ children, onClick, type = 'button', ...props }: any) => (
    <button type={type} onClick={onClick} {...props}>
      {children}
    </button>
  ),
  IconButton: ({
    children,
    onClick,
    disabled,
    type = 'button',
    ...props
  }: any) => (
    <button type={type} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  H6: ({ children }: any) => <h6>{children}</h6>,
  Caption: ({ children }: any) => <span>{children}</span>,
  ErrorText: ({ children }: any) => <span role="alert">{children}</span>,
  Stack: ({ children, gap }: any) => <div style={{ gap }}>{children}</div>,
  Checkbox: ({ ...props }: any) => <input type="checkbox" {...props} />,
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
    mode: 'onChange',
    defaultValues: {
      ingredients: [],
      ...defaultValues,
    },
  })

  return (
    <ThemeWrapper>
      <FormProvider {...methods}>{children}</FormProvider>
    </ThemeWrapper>
  )
}

describe('IngredientsForm', () => {
  it('renders with empty state message initially', () => {
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    expect(screen.getByText(/no ingredients added yet/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add ingredient/i }),
    ).toBeInTheDocument()
  })

  it('adds a new ingredient when Add Ingredient is clicked', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add ingredient/i })
    await user.click(addButton)

    // Should now show ingredient input fields
    expect(screen.getByPlaceholderText(/ingredient name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/amount/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/no ingredients added yet/i),
    ).not.toBeInTheDocument()
  })

  it('validates ingredient name is required', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    // Add an ingredient
    const addButton = screen.getByRole('button', { name: /add ingredient/i })
    await user.click(addButton)

    // Try to submit without filling in the name
    const nameInput = screen.getByPlaceholderText(/ingredient name/i)
    const amountInput = screen.getByPlaceholderText(/amount/i)

    await user.type(amountInput, '1 cup')
    await user.click(nameInput)
    await user.tab() // Blur to trigger validation

    await waitFor(() => {
      expect(
        screen.getByText(/ingredient name is required/i),
      ).toBeInTheDocument()
    })
  })

  it('validates amount is required', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    // Add an ingredient
    const addButton = screen.getByRole('button', { name: /add ingredient/i })
    await user.click(addButton)

    // Try to submit without filling in the amount
    const nameInput = screen.getByPlaceholderText(/ingredient name/i)
    const amountInput = screen.getByPlaceholderText(/amount/i)

    await user.type(nameInput, 'Flour')
    await user.click(amountInput)
    await user.tab() // Blur to trigger validation

    await waitFor(() => {
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument()
    })
  })

  it('accepts valid ingredient input', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add ingredient/i })
    await user.click(addButton)

    const nameInput = screen.getByPlaceholderText(/ingredient name/i)
    const amountInput = screen.getByPlaceholderText(/amount/i)

    await user.type(nameInput, 'All-purpose flour')
    await user.type(amountInput, '2 cups')

    expect(nameInput).toHaveValue('All-purpose flour')
    expect(amountInput).toHaveValue('2 cups')
  })

  it('allows toggling spice checkbox', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add ingredient/i })
    await user.click(addButton)

    const spiceCheckbox = screen.getByRole('checkbox', { name: /spice/i })
    expect(spiceCheckbox).not.toBeChecked()

    await user.click(spiceCheckbox)
    expect(spiceCheckbox).toBeChecked()

    await user.click(spiceCheckbox)
    expect(spiceCheckbox).not.toBeChecked()
  })

  it('allows adding multiple ingredients', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add ingredient/i })

    // Add first ingredient
    await user.click(addButton)
    let nameInputs = screen.getAllByPlaceholderText(/ingredient name/i)
    let amountInputs = screen.getAllByPlaceholderText(/amount/i)

    await user.type(nameInputs[0], 'Flour')
    await user.type(amountInputs[0], '2 cups')

    // Add second ingredient
    await user.click(addButton)
    nameInputs = screen.getAllByPlaceholderText(/ingredient name/i)
    amountInputs = screen.getAllByPlaceholderText(/amount/i)

    expect(nameInputs).toHaveLength(2)
    expect(amountInputs).toHaveLength(2)

    await user.type(nameInputs[1], 'Sugar')
    await user.type(amountInputs[1], '1 cup')

    expect(nameInputs[0]).toHaveValue('Flour')
    expect(amountInputs[0]).toHaveValue('2 cups')
    expect(nameInputs[1]).toHaveValue('Sugar')
    expect(amountInputs[1]).toHaveValue('1 cup')
  })

  it('removes an ingredient when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper
        defaultValues={{
          ingredients: [
            { name: 'Flour', amount: '2 cups', isSpice: false },
            { name: 'Sugar', amount: '1 cup', isSpice: false },
          ],
        }}
      >
        <IngredientsForm />
      </FormWrapper>,
    )

    // Should have 2 ingredients
    let nameInputs = screen.getAllByPlaceholderText(/ingredient name/i)
    expect(nameInputs).toHaveLength(2)

    // Find and click the first delete button
    const deleteButtons = screen.getAllByTestId('DeleteIcon')
    await user.click(deleteButtons[0])

    // Should now have 1 ingredient
    nameInputs = screen.getAllByPlaceholderText(/ingredient name/i)
    expect(nameInputs).toHaveLength(1)
    expect(nameInputs[0]).toHaveValue('Sugar')
  })

  it('does not show delete button when only one ingredient exists', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add ingredient/i })
    await user.click(addButton)

    // Should not have delete button with only one ingredient
    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument()

    // Add another ingredient
    await user.click(addButton)

    // Now should have delete buttons
    const deleteButtons = screen.getAllByTestId('DeleteIcon')
    expect(deleteButtons).toHaveLength(2)
  })

  it('validates at least one ingredient is required', async () => {
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    // Error should be shown for empty ingredients
    expect(
      screen.getByText(/at least one ingredient is required/i),
    ).toBeInTheDocument()
  })

  it('handles ingredient with special characters', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add ingredient/i })
    await user.click(addButton)

    const nameInput = screen.getByPlaceholderText(/ingredient name/i)
    const amountInput = screen.getByPlaceholderText(/amount/i)

    await user.type(nameInput, 'Crème fraîche')
    await user.type(amountInput, '1/2 cup + 2 tbsp')

    expect(nameInput).toHaveValue('Crème fraîche')
    expect(amountInput).toHaveValue('1/2 cup + 2 tbsp')
  })

  it('preserves ingredient order when deleting from middle', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper
        defaultValues={{
          ingredients: [
            { name: 'First', amount: '1', isSpice: false },
            { name: 'Second', amount: '2', isSpice: false },
            { name: 'Third', amount: '3', isSpice: false },
          ],
        }}
      >
        <IngredientsForm />
      </FormWrapper>,
    )

    const deleteButtons = screen.getAllByTestId('DeleteIcon')
    // Delete the middle ingredient (Second)
    await user.click(deleteButtons[1])

    const nameInputs = screen.getAllByPlaceholderText(/ingredient name/i)
    expect(nameInputs).toHaveLength(2)
    expect(nameInputs[0]).toHaveValue('First')
    expect(nameInputs[1]).toHaveValue('Third')
  })

  it('clears validation errors when valid data is entered', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <IngredientsForm />
      </FormWrapper>,
    )

    // Add an ingredient
    const addButton = screen.getByRole('button', { name: /add ingredient/i })
    await user.click(addButton)

    const nameInput = screen.getByPlaceholderText(/ingredient name/i)
    await user.click(nameInput)
    await user.tab() // Trigger validation

    await waitFor(() => {
      expect(
        screen.getByText(/ingredient name is required/i),
      ).toBeInTheDocument()
    })

    // Now enter valid data
    await user.type(nameInput, 'Flour')

    await waitFor(() => {
      expect(
        screen.queryByText(/ingredient name is required/i),
      ).not.toBeInTheDocument()
    })
  })

  it('maintains spice status when editing other fields', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper
        defaultValues={{
          ingredients: [{ name: 'Salt', amount: '1 tsp', isSpice: true }],
        }}
      >
        <IngredientsForm />
      </FormWrapper>,
    )

    const spiceCheckbox = screen.getByRole('checkbox', { name: /spice/i })
    expect(spiceCheckbox).toBeChecked()

    // Edit the name
    const nameInput = screen.getByPlaceholderText(/ingredient name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Sea Salt')

    // Spice checkbox should still be checked
    expect(spiceCheckbox).toBeChecked()
  })
})
