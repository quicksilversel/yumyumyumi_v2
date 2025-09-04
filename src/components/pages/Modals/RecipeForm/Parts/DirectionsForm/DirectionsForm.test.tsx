/* eslint-disable react/display-name */
import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, FormProvider } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { ThemeWrapper } from '@/lib/jest/ThemeWrapper'
import { recipeFormSchema } from '@/types/recipe'

import { DirectionsForm } from './DirectionsForm'

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
  Textarea: React.forwardRef<HTMLTextAreaElement, any>(
    ({ error, rows = 3, ...props }: any, ref) => (
      <textarea ref={ref} rows={rows} {...props} data-error={error} />
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
      directions: [],
      ...defaultValues,
    },
  })

  return (
    <ThemeWrapper>
      <FormProvider {...methods}>{children}</FormProvider>
    </ThemeWrapper>
  )
}

describe('DirectionsForm', () => {
  it('renders with empty state message initially', () => {
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    expect(screen.getByText(/no directions added yet/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add step/i }),
    ).toBeInTheDocument()
  })

  it('adds a new direction step when Add Step is clicked', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add step/i })
    await user.click(addButton)

    // Should now show direction input fields
    expect(screen.getByPlaceholderText(/step title/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/step description/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/no directions added yet/i),
    ).not.toBeInTheDocument()
  })

  it('validates that either title or description is required', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    // Add a direction
    const addButton = screen.getByRole('button', { name: /add step/i })
    await user.click(addButton)

    // Leave both fields empty and blur
    const titleInput = screen.getByPlaceholderText(/step title/i)
    const descriptionInput = screen.getByPlaceholderText(/step description/i)

    await user.click(titleInput)
    await user.click(descriptionInput)
    await user.tab() // Blur to trigger validation

    await waitFor(() => {
      expect(
        screen.getByText(/either title or description is required/i),
      ).toBeInTheDocument()
    })
  })

  it('accepts valid direction with only title', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add step/i })
    await user.click(addButton)

    const titleInput = screen.getByPlaceholderText(/step title/i)
    await user.type(titleInput, 'Preheat oven')

    expect(titleInput).toHaveValue('Preheat oven')

    // Should not show validation error
    await waitFor(() => {
      expect(
        screen.queryByText(/either title or description is required/i),
      ).not.toBeInTheDocument()
    })
  })

  it('accepts valid direction with only description', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add step/i })
    await user.click(addButton)

    const descriptionInput = screen.getByPlaceholderText(/step description/i)
    await user.type(descriptionInput, 'Mix all dry ingredients in a large bowl')

    expect(descriptionInput).toHaveValue(
      'Mix all dry ingredients in a large bowl',
    )

    // Should not show validation error
    await waitFor(() => {
      expect(
        screen.queryByText(/either title or description is required/i),
      ).not.toBeInTheDocument()
    })
  })

  it('accepts valid direction with both title and description', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add step/i })
    await user.click(addButton)

    const titleInput = screen.getByPlaceholderText(/step title/i)
    const descriptionInput = screen.getByPlaceholderText(/step description/i)

    await user.type(titleInput, 'Prepare ingredients')
    await user.type(
      descriptionInput,
      'Chop all vegetables and measure out spices',
    )

    expect(titleInput).toHaveValue('Prepare ingredients')
    expect(descriptionInput).toHaveValue(
      'Chop all vegetables and measure out spices',
    )
  })

  it('displays step numbers correctly', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper
        defaultValues={{
          directions: [
            { title: 'Step 1', description: 'First step' },
            { title: 'Step 2', description: 'Second step' },
            { title: 'Step 3', description: 'Third step' },
          ],
        }}
      >
        <DirectionsForm />
      </FormWrapper>,
    )

    // Check that step numbers are displayed
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('allows adding multiple direction steps', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add step/i })

    // Add first step
    await user.click(addButton)
    let titleInputs = screen.getAllByPlaceholderText(/step title/i)
    await user.type(titleInputs[0], 'Preheat oven')

    // Add second step
    await user.click(addButton)
    titleInputs = screen.getAllByPlaceholderText(/step title/i)
    expect(titleInputs).toHaveLength(2)
    await user.type(titleInputs[1], 'Mix ingredients')

    // Add third step
    await user.click(addButton)
    titleInputs = screen.getAllByPlaceholderText(/step title/i)
    expect(titleInputs).toHaveLength(3)
    await user.type(titleInputs[2], 'Bake')

    expect(titleInputs[0]).toHaveValue('Preheat oven')
    expect(titleInputs[1]).toHaveValue('Mix ingredients')
    expect(titleInputs[2]).toHaveValue('Bake')
  })

  it('removes a direction step when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper
        defaultValues={{
          directions: [
            { title: 'First step' },
            { title: 'Second step' },
            { title: 'Third step' },
          ],
        }}
      >
        <DirectionsForm />
      </FormWrapper>,
    )

    // Should have 3 steps
    let titleInputs = screen.getAllByPlaceholderText(/step title/i)
    expect(titleInputs).toHaveLength(3)

    // Delete the second step
    const deleteButtons = screen.getAllByTestId('DeleteIcon')
    await user.click(deleteButtons[1])

    // Should now have 2 steps
    titleInputs = screen.getAllByPlaceholderText(/step title/i)
    expect(titleInputs).toHaveLength(2)
    expect(titleInputs[0]).toHaveValue('First step')
    expect(titleInputs[1]).toHaveValue('Third step')
  })

  it('does not show delete button when only one step exists', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add step/i })
    await user.click(addButton)

    // Should not have delete button with only one step
    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument()

    // Add another step
    await user.click(addButton)

    // Now should have delete buttons
    const deleteButtons = screen.getAllByTestId('DeleteIcon')
    expect(deleteButtons).toHaveLength(2)
  })

  it('validates at least one direction is required', () => {
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    // Error should be shown for empty directions
    expect(
      screen.getByText(/at least one direction is required/i),
    ).toBeInTheDocument()
  })

  it('handles long text in description field', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add step/i })
    await user.click(addButton)

    const descriptionInput = screen.getByPlaceholderText(/step description/i)
    const longText =
      'In a large mixing bowl, combine all the dry ingredients including flour, sugar, baking powder, and salt. Make sure to sift the flour to avoid lumps. In a separate bowl, whisk together the wet ingredients including eggs, milk, and melted butter. Gradually fold the wet ingredients into the dry ingredients, being careful not to overmix as this can result in tough texture.'

    await user.type(descriptionInput, longText)
    expect(descriptionInput).toHaveValue(longText)
  })

  it('preserves step order when deleting from middle', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper
        defaultValues={{
          directions: [
            { title: 'Step A', description: 'First' },
            { title: 'Step B', description: 'Second' },
            { title: 'Step C', description: 'Third' },
            { title: 'Step D', description: 'Fourth' },
          ],
        }}
      >
        <DirectionsForm />
      </FormWrapper>,
    )

    const deleteButtons = screen.getAllByTestId('DeleteIcon')
    // Delete Step B (index 1)
    await user.click(deleteButtons[1])

    const titleInputs = screen.getAllByPlaceholderText(/step title/i)
    expect(titleInputs).toHaveLength(3)
    expect(titleInputs[0]).toHaveValue('Step A')
    expect(titleInputs[1]).toHaveValue('Step C')
    expect(titleInputs[2]).toHaveValue('Step D')

    // Step numbers should update correctly
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.queryByText('4')).not.toBeInTheDocument()
  })

  it('clears validation error when valid data is entered', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add step/i })
    await user.click(addButton)

    const descriptionInput = screen.getByPlaceholderText(/step description/i)

    // Trigger validation by focusing and blurring empty fields
    await user.click(descriptionInput)
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText(/either title or description is required/i),
      ).toBeInTheDocument()
    })

    // Now enter valid data
    await user.type(descriptionInput, 'Mix ingredients')

    await waitFor(() => {
      expect(
        screen.queryByText(/either title or description is required/i),
      ).not.toBeInTheDocument()
    })
  })

  it('handles special characters and formatting in directions', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <DirectionsForm />
      </FormWrapper>,
    )

    const addButton = screen.getByRole('button', { name: /add step/i })
    await user.click(addButton)

    const titleInput = screen.getByPlaceholderText(/step title/i)
    const descriptionInput = screen.getByPlaceholderText(/step description/i)

    await user.type(titleInput, 'Sauté @ 350°F')
    await user.type(
      descriptionInput,
      'Add 1/2 cup crème fraîche & stir for 2-3 minutes',
    )

    expect(titleInput).toHaveValue('Sauté @ 350°F')
    expect(descriptionInput).toHaveValue(
      'Add 1/2 cup crème fraîche & stir for 2-3 minutes',
    )
  })
})
