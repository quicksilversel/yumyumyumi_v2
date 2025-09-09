import { ReactNode, useState, useCallback } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Theme } from '@emotion/react'

export type FieldSize = 'small' | 'medium' | 'large'

export interface FloatingLabelFieldProps {
  id?: string
  title?: string
  icon?: ReactNode
  value?: any
  error?: boolean
  required?: boolean
  disabled?: boolean
  helperText?: string
  size?: FieldSize
  children: (props: {
    isFocused: boolean
    handleFocus: (e: any) => void
    handleBlur: (e: any) => void
  }) => ReactNode
  onFocus?: (e: any) => void
  onBlur?: (e: any) => void
}

export const FloatingLabelField = ({
  id,
  title,
  icon,
  value,
  error,
  required,
  disabled,
  helperText,
  size = 'medium',
  children,
  onFocus,
  onBlur,
}: FloatingLabelFieldProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const hasValue = value !== undefined && value !== '' && value !== null
  const shouldFloatLabel = isFocused || hasValue

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus],
  )

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur],
  )

  return (
    <Container>
      <FieldWrapper>
        {children({ isFocused, handleFocus, handleBlur })}
        {title && (
          <FloatingLabel
            htmlFor={id}
            isRequired={required}
            isFloating={shouldFloatLabel}
            isFocused={isFocused}
            hasError={error}
            isDisabled={disabled}
            size={size}
          >
            {icon && <IconWrapper>{icon}</IconWrapper>}
            <LabelText>{title}</LabelText>
          </FloatingLabel>
        )}
      </FieldWrapper>
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
`

const FieldWrapper = styled.div`
  position: relative;
  width: 100%;
`

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing[1]};
  font-size: inherit;
`

const LabelText = styled.span`
  display: inline-block;
`

const FloatingLabel = styled.label<{
  isRequired?: boolean
  isFloating: boolean
  isFocused: boolean
  hasError?: boolean
  isDisabled?: boolean
  size: FieldSize
}>`
  position: absolute;
  left: 14px;
  color: ${({ theme, hasError, isFocused, isDisabled }) => {
    if (isDisabled) return theme.colors.gray[400]
    if (hasError) return theme.colors.error
    if (isFocused) return theme.colors.primary
    return theme.colors.gray[600]
  }};
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left top;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 45%,
    ${({ theme }) => theme.colors.white} 45%,
    ${({ theme }) => theme.colors.white} 100%
  );
  padding: 0 4px;
  margin-left: -4px;
  display: inline-flex;
  align-items: center;
  z-index: 1;

  ${({ isFloating, theme, size }) => {
    const sizes = {
      small: { normal: '14px', floating: '12px', top: '-8px', center: '16px' },
      medium: { normal: '16px', floating: '12px', top: '-9px', center: '20px' },
      large: { normal: '18px', floating: '14px', top: '-10px', center: '24px' },
    }
    const config = sizes[size]

    return isFloating
      ? css`
          top: ${config.top};
          font-size: ${config.floating};
          font-weight: ${theme.typography.fontWeight.medium};
        `
      : css`
          top: ${config.center};
          font-size: ${config.normal};
          font-weight: ${theme.typography.fontWeight.normal};
        `
  }}

  ${({ theme, isRequired }) =>
    isRequired &&
    css`
      &:after {
        content: ' *';
        color: ${theme.colors.error};
        margin-left: 2px;
      }
    `}
`

const HelperText = styled.span<{ error?: boolean }>`
  display: block;
  margin-top: ${({ theme }) => theme.spacing[1]};
  padding-left: 14px;
  color: ${({ error, theme }) =>
    error ? theme.colors.error : theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  line-height: 1.4;
`

export const FieldStyles = {
  getFieldStyles: ({
    theme,
    error,
    isFocused,
  }: {
    theme: Theme
    error: boolean
    isFocused: boolean
  }) => css`
    width: 100%;
    border: ${isFocused ? '2px' : '1px'} solid
      ${(() => {
        if (error) return theme.colors.error
        if (isFocused) return theme.colors.primary
        return theme.colors.gray[300]
      })()};
    border-radius: ${theme.borderRadius.md};
    background-color: ${theme.colors.white};
    color: ${theme.colors.black};
    transition: all ${theme.transition.default};
    outline: none;
    font-family: inherit;

    &:hover:not(:disabled):not(:focus) {
      border-color: ${error ? theme.colors.error : theme.colors.gray[400]};
    }

    &:disabled {
      background-color: ${theme.colors.gray[50]};
      color: ${theme.colors.gray[500]};
      cursor: not-allowed;
      border-color: ${theme.colors.gray[200]};
    }

    &::placeholder {
      color: ${theme.colors.gray[400]};
      opacity: ${isFocused ? 0.7 : 0};
      transition: opacity 0.2s ease-in-out;
    }
  `,

  getInputPadding: (size: FieldSize) => {
    const paddings = {
      small: '14px 12px',
      medium: '18px 14px',
      large: '22px 16px',
    }
    return paddings[size]
  },

  getTextareaPadding: (size: FieldSize) => {
    const paddings = {
      small: '14px 12px',
      medium: '18px 14px',
      large: '22px 16px',
    }
    return paddings[size]
  },

  getFontSize: (size: FieldSize, theme: Theme) => {
    const sizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.base,
      large: theme.typography.fontSize.lg,
    }
    return sizes[size]
  },
}
