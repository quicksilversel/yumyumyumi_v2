import { InputHTMLAttributes, DetailedHTMLProps } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import {
  colors,
  typography,
  spacing,
  borderRadius,
  transition,
} from '@/styles/designTokens'

type InputSize = 'small' | 'medium' | 'large'

export interface InputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'size'
  > {
  title?: string
  height?: InputSize
  error?: boolean
}

export const Input = ({
  title,
  type = 'text',
  height = 'medium',
  error,
  ...inputProps
}: InputProps) => {
  const isEmpty =
    type === 'number'
      ? inputProps.value === 0
      : inputProps.value === '' ||
        inputProps.value === null ||
        inputProps.value === undefined

  const hasError = !!error || (inputProps.required && isEmpty)

  return (
    <Container>
      {title && (
        <Label htmlFor={inputProps.id}>
          {title}
          {inputProps.required && '*'}
        </Label>
      )}
      <StyledInput
        type={type}
        height={height}
        error={hasError}
        {...inputProps}
      />
    </Container>
  )
}

const sizeStyles = {
  small: css`
    height: 32px;
    padding: 0 ${spacing[3]};
    font-size: ${typography.fontSize.sm};
  `,
  medium: css`
    height: 40px;
    padding: 0 ${spacing[4]};
    font-size: ${typography.fontSize.base};
  `,
  large: css`
    height: 48px;
    padding: 0 ${spacing[5]};
    font-size: ${typography.fontSize.lg};
  `,
}
const Container = styled.div`
  width: 100%;
`

const Label = styled.label`
  display: block;
  margin-bottom: ${spacing[1]};
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[800]};
`

const StyledInput = styled.input<{
  height?: InputSize
  error?: boolean
}>`
  width: 100%;
  border: 1px solid
    ${(props) => (props.error ? colors.error : colors.gray[300])};
  border-radius: ${borderRadius.default};
  background-color: ${colors.white};
  color: ${colors.black};
  font-family: ${typography.fontFamily.sans};
  transition: all ${transition.default};
  outline: none;

  ${(props) => sizeStyles[props.height || 'medium']}

  &::placeholder {
    color: ${colors.gray[400]};
  }

  &:hover:not(:disabled) {
    border-color: ${(props) => (props.error ? colors.error : colors.gray[400])};
  }

  &:focus {
    border-color: ${(props) => (props.error ? colors.error : colors.black)};
    box-shadow: 0 0 0 1px
      ${(props) => (props.error ? colors.error : colors.black)};
  }

  &:disabled {
    background-color: ${colors.gray[50]};
    color: ${colors.gray[500]};
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
