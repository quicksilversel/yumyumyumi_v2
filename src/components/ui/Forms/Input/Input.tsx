import { InputHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

import { css } from '@emotion/react'
import { Theme } from '@emotion/react'
import styled from '@emotion/styled'

type InputSize = 'small' | 'medium' | 'large'

export interface InputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'size'
  > {
  title?: string
  icon?: ReactNode
  height?: InputSize
  error?: boolean
}

export const Input = ({
  title,
  type = 'text',
  height = 'small',
  icon,
  ...inputProps
}: InputProps) => {
  return (
    <Container>
      {title && (
        <Label htmlFor={inputProps.id}>
          {icon}
          {title}
          {inputProps.required && '*'}
        </Label>
      )}
      <StyledInput
        type={type}
        height={height}
        autoComplete="off"
        {...inputProps}
      />
    </Container>
  )
}

const sizeStyles = ({ theme, size }: { theme: Theme; size: InputSize }) => {
  switch (size) {
    case 'small':
      return css`
        height: 32px;
        padding: 0 ${theme.spacing[3]};
        font-size: ${theme.typography.fontSize.sm};
      `
    case 'medium':
      return css`
        height: 40px;
        padding: 0 ${theme.spacing[4]};
        font-size: ${theme.typography.fontSize.base};
      `
    case 'large':
      return css`
        height: 48px;
        padding: 0 ${theme.spacing[5]};
        font-size: ${theme.typography.fontSize.lg};
      `
  }
}

const Container = styled.div`
  width: 100%;
`

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing['1']};
  font-size: ${({ theme }) => theme.typography.fontSize['sm']};
  color: ${({ theme }) => theme.colors.gray[800]};
`

const StyledInput = styled.input<{
  height?: InputSize
  error?: boolean
}>`
  width: 100%;
  border: 1px solid
    ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  transition: border-color ${({ theme }) => theme.transition.default};
  outline: none;

  ${({ theme, height }) => sizeStyles({ theme, size: height || 'medium' })}

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray['400']};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.black};
    box-shadow: 0 0 0 1px
      ${({ theme, error }) => (error ? theme.colors.error : theme.colors.black)};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray['50']};
    color: ${({ theme }) => theme.colors.gray['500']};
    cursor: not-allowed;
  }

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    appearance: textfield;
  }
`

Input.Label = Label
