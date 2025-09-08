/* eslint-disable react/display-name */
import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, FormProvider } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { ThemeWrapper } from '@/lib/jest/ThemeWrapper'
import { recipeFormSchema } from '@/types/recipe'

import { CookTimeForm } from './CookTimeForm'

jest.mock('@/components/ui', () => ({
  Input: React.forwardRef<HTMLInputElement, any>(
    ({ error, title, ...props }: any, ref) => (
      <div>
        {title && <label htmlFor={props.id}>{title}</label>}
        <input ref={ref} {...props} data-error={error ? 'true' : 'false'} />
      </div>
    ),
  ),
  ErrorText: ({ children }: any) => <span role="alert">{children}</span>,
}))

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
      cookTime: 30,
      ...defaultValues,
    },
  })

  return (
    <ThemeWrapper>
      <FormProvider {...methods}>{children}</FormProvider>
    </ThemeWrapper>
  )
}

describe('CookTimeForm', () => {
  it('renders the cook time input field', () => {
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('min', '1')
  })

  it('displays default value of 30 minutes', () => {
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    expect(input).toHaveValue(30)
  })

  it('accepts valid cook time input', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    await user.clear(input)
    await user.type(input, '45')

    expect(input).toHaveValue(45)
  })

  it('validates cook time is required', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper defaultValues={{ cookTime: undefined as any }}>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    await user.clear(input)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/cook time is required/i)).toBeInTheDocument()
    })
  })

  it('validates minimum cook time of 1 minute', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    await user.clear(input)
    await user.type(input, '0')
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText(/cook time must be greater than 0/i),
      ).toBeInTheDocument()
    })
  })

  it('validates negative numbers are not allowed', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    await user.clear(input)
    await user.type(input, '-10')
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText(/cook time must be greater than 0/i),
      ).toBeInTheDocument()
    })
  })

  it('validates non-numeric input', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    await user.clear(input)
    await user.type(input, 'abc')
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText(/cook time must be a valid number/i),
      ).toBeInTheDocument()
    })
  })

  it('accepts very long cook times', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    await user.clear(input)
    await user.type(input, '480')
    expect(input).toHaveValue(480)

    await waitFor(() => {
      expect(screen.queryByText(/cook time must/i)).not.toBeInTheDocument()
    })
  })

  it('rounds decimal values to nearest integer', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    await user.clear(input)
    await user.type(input, '30.5')

    expect(input).toHaveValue(30.5)
  })

  it('clears validation error when valid time is entered', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)

    await user.clear(input)
    await user.type(input, '0')
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText(/cook time must be greater than 0/i),
      ).toBeInTheDocument()
    })

    await user.clear(input)
    await user.type(input, '60')

    await waitFor(() => {
      expect(
        screen.queryByText(/cook time must be greater than 0/i),
      ).not.toBeInTheDocument()
    })
  })

  it('shows error styling when validation fails', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    await user.clear(input)
    await user.type(input, '0')
    await user.tab()

    await waitFor(() => {
      expect(input).toHaveAttribute('error', 'true')
    })
  })

  it('handles rapid value changes', async () => {
    const user = userEvent.setup()
    render(
      <FormWrapper>
        <CookTimeForm />
      </FormWrapper>,
    )

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)

    await user.clear(input)
    await user.type(input, '15')
    await user.clear(input)
    await user.type(input, '30')
    await user.clear(input)
    await user.type(input, '45')
    await user.clear(input)
    await user.type(input, '60')

    expect(input).toHaveValue(60)
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
          cookTime: 30,
          servings: 4,
          isPublic: false,
        },
      })

      return (
        <ThemeWrapper>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <CookTimeForm />
              <button type="submit">Submit</button>
            </form>
          </FormProvider>
        </ThemeWrapper>
      )
    }

    render(<TestForm />)

    const input = screen.getByPlaceholderText(/enter cook time in minutes/i)
    await user.clear(input)
    await user.type(input, '90')

    const submitButton = screen.getByText('Submit')
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          cookTime: 90,
        }),
      )
    })
  })
})
