import {
  InputHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from 'react'

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
  value,
  ...inputProps
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasAutofillValue, setHasAutofillValue] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isPasswordField =
    type === 'password' ||
    (type === 'text' && inputProps.autoComplete?.includes('password'))

  const hasValue = isPasswordField
    ? inputRef.current?.value !== '' && inputRef.current?.value !== undefined
    : value !== undefined && value !== '' && value !== null

  const shouldFloatLabel = isFocused || hasValue || hasAutofillValue

  useEffect(() => {
    const checkAutofill = () => {
      if (inputRef.current) {
        const isAutofilled = inputRef.current.matches(':-webkit-autofill')
        const hasSimulatedAutofill = inputRef.current.closest(
          '.autofill-simulation',
        )
        setHasAutofillValue(isAutofilled || !!hasSimulatedAutofill)
      }
    }

    checkAutofill()

    const interval = setInterval(checkAutofill, 300)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    inputProps.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    inputProps.onBlur?.(e)
  }

  return (
    <Container>
      <InputWrapper>
        <StyledInput
          ref={inputRef}
          type={type}
          height={height}
          value={value}
          {...inputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          hasFloatingLabel={!!title}
        />
        {title && (
          <FloatingLabel
            htmlFor={inputProps.id}
            isRequired={inputProps.required}
            isFloating={shouldFloatLabel}
            isFocused={isFocused}
            hasError={inputProps.error}
            hasAutofill={hasAutofillValue}
          >
            {icon && <IconWrapper>{icon}</IconWrapper>}
            {title}
          </FloatingLabel>
        )}
      </InputWrapper>
    </Container>
  )
}

const sizeStyles = ({ theme, size }: { theme: Theme; size: InputSize }) => {
  switch (size) {
    case 'small':
      return css`
        height: 48px;
        padding: 0 ${theme.spacing[3]};
        font-size: ${theme.typography.fontSize.sm};
      `
    case 'medium':
      return css`
        height: 56px;
        padding: 0 ${theme.spacing[4]};
        font-size: ${theme.typography.fontSize.base};
      `
    case 'large':
      return css`
        height: 64px;
        padding: 0 ${theme.spacing[5]};
        font-size: ${theme.typography.fontSize.lg};
      `
  }
}

const Container = styled.div`
  width: 100%;
`

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing[1]};
`

const FloatingLabel = styled.label<{
  isRequired?: boolean
  isFloating: boolean
  isFocused: boolean
  hasError?: boolean
  hasAutofill?: boolean
}>`
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  margin-left: -4px;
  color: ${({ theme, hasError, isFocused }) => {
    if (hasError) return theme.colors.error
    if (isFocused) return theme.colors.primary
    return theme.colors.gray[600]
  }};
  pointer-events: none;
  transform-origin: left top;
  transition: all 0.2s ease-in-out;

  ${({ theme, hasAutofill, isFloating }) => {
    if (hasAutofill && isFloating) {
      return css`
        text-shadow:
          1px 1px 0 rgb(255, 255, 255, 0.8),
          -1px -1px 0 rgb(255, 255, 255, 0.8),
          1px -1px 0 rgb(255, 255, 255, 0.8),
          -1px 1px 0 rgb(255, 255, 255, 0.8);
        background-color: transparent;
      `
    } else if (isFloating) {
      return css`
        background-color: ${theme.colors.white};

        &::before {
          position: absolute;
          top: 50%;
          right: -2px;
          left: -2px;
          z-index: -1;
          height: 2px;
          content: '';
          background-color: ${theme.colors.white};
        }
      `
    } else {
      return css`
        background-color: transparent;
      `
    }
  }}

  ${({ isFloating, theme }) =>
    isFloating
      ? css`
          top: -8px;
          z-index: 1;
          font-size: 12px;
          font-weight: ${theme.typography.fontWeight.medium};
          transform: scale(0.85);
        `
      : css`
          top: 50%;
          font-size: ${theme.typography.fontSize.sm};
          transform: translateY(-50%);
        `}

  ${({ theme, isRequired }) =>
    isRequired &&
    css`
      &::after {
        color: ${theme.colors.error};
        content: ' *';
      }
    `}
`

const StyledInput = styled.input<{
  height?: InputSize
  error?: boolean
  hasFloatingLabel?: boolean
}>`
  width: 100%;
  color: ${({ theme }) => theme.colors.black};
  outline: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid
    ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: border-color ${({ theme }) => theme.transition.default};

  ${({ theme, height }) => sizeStyles({ theme, size: height || 'medium' })}

  &:focus, &:hover:not(:disabled) {
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.primary};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.gray[500]};
    pointer-events: none;
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }

  &[type='number'] {
    appearance: textfield;
  }

  ${({ hasFloatingLabel }) =>
    hasFloatingLabel &&
    css`
      &::placeholder {
        opacity: 0;
      }

      &:focus::placeholder {
        opacity: 0.6;
        transition: opacity 0.2s ease-in-out;
      }
    `}
`

Input.Label = FloatingLabel
