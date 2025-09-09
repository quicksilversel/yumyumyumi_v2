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
        setHasAutofillValue(isAutofilled)
      }
    }

    checkAutofill()

    const interval = setInterval(checkAutofill, 100)

    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'onAutoFillStart') {
        setHasAutofillValue(true)
      }
    }

    const handleAnimationCancel = (e: AnimationEvent) => {
      if (e.animationName === 'onAutoFillCancel') {
        setHasAutofillValue(false)
      }
    }

    const input = inputRef.current
    if (input) {
      input.addEventListener('animationstart', handleAnimationStart)
      input.addEventListener('animationcancel', handleAnimationCancel)
    }

    return () => {
      clearInterval(interval)
      if (input) {
        input.removeEventListener('animationstart', handleAnimationStart)
        input.removeEventListener('animationcancel', handleAnimationCancel)
      }
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
          autoComplete="off"
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
}>`
  position: absolute;
  left: 12px;
  color: ${({ theme, hasError, isFocused }) => {
    if (hasError) return theme.colors.error
    if (isFocused) return theme.colors.primary
    return theme.colors.gray[600]
  }};
  pointer-events: none;
  transition: all 0.2s ease-in-out;
  transform-origin: left top;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 4px;
  margin-left: -4px;
  display: flex;
  align-items: center;

  ${({ isFloating, theme }) =>
    isFloating
      ? css`
          top: -8px;
          font-size: 12px;
          transform: scale(0.85);
          font-weight: ${theme.typography.fontWeight.medium};
        `
      : css`
          top: 50%;
          transform: translateY(-50%);
          font-size: ${theme.typography.fontSize.sm};
        `}

  ${({ theme, isRequired }) =>
    isRequired &&
    css`
      &:after {
        content: ' *';
        color: ${theme.colors.error};
      }
    `}
`

const StyledInput = styled.input<{
  height?: InputSize
  error?: boolean
  hasFloatingLabel?: boolean
}>`
  width: 100%;
  border: 1px solid
    ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  transition: border-color ${({ theme }) => theme.transition.default};
  outline: none;

  ${({ theme, height }) => sizeStyles({ theme, size: height || 'medium' })}

  &:focus, &:hover:not(:disabled) {
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
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

  /* Autofill detection animations */
  @keyframes onAutoFillStart {
    from {
      /* */
    }
    to {
      /* */
    }
  }
  @keyframes onAutoFillCancel {
    from {
      /* */
    }
    to {
      /* */
    }
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-animation-delay: 1s;
    -webkit-animation-name: onAutoFillStart;
    -webkit-animation-fill-mode: both;

    -webkit-box-shadow: 0 0 0 30px ${({ theme }) => theme.colors.white} inset !important;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.black} !important;

    border-color: ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.gray[300]} !important;
  }

  &:not(:-webkit-autofill) {
    -webkit-animation-name: onAutoFillCancel;
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

      &:-webkit-autofill::placeholder {
        opacity: 0 !important;
      }
    `}
`

Input.Label = FloatingLabel
