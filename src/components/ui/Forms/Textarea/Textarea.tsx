import {
  TextareaHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  useState,
} from 'react'

import { css } from '@emotion/react'
import { Theme } from '@emotion/react'
import styled from '@emotion/styled'

type TextareaSize = 'small' | 'medium' | 'large'
type ResizeOption = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextareaProps
  extends Omit<
    DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    'size'
  > {
  title?: string
  icon?: ReactNode
  height?: TextareaSize
  error?: boolean
  helperText?: string
  resize?: ResizeOption
  minRows?: number
  maxRows?: number
}

export const Textarea = ({
  title,
  icon,
  height = 'small',
  error,
  helperText,
  resize = 'vertical',
  minRows = 3,
  maxRows,
  value,
  ...textareaProps
}: TextareaProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const hasValue = value !== undefined && value !== '' && value !== null
  const shouldFloatLabel = isFocused || hasValue

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    textareaProps.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    textareaProps.onBlur?.(e)
  }

  return (
    <Container>
      <TextareaWrapper>
        <StyledTextarea
          height={height}
          error={error}
          resize={resize}
          minRows={minRows}
          maxRows={maxRows}
          value={value}
          {...textareaProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          hasFloatingLabel={!!title}
        />
        {title && (
          <FloatingLabel
            htmlFor={textareaProps.id}
            isRequired={textareaProps.required}
            isFloating={shouldFloatLabel}
            isFocused={isFocused}
            hasError={error}
          >
            {icon && <IconWrapper>{icon}</IconWrapper>}
            {title}
          </FloatingLabel>
        )}
      </TextareaWrapper>
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </Container>
  )
}

const sizeStyles = ({ theme, size }: { theme: Theme; size: TextareaSize }) => {
  switch (size) {
    case 'small':
      return css`
        padding: 16px 12px 8px;
        font-size: ${theme.typography.fontSize.sm};
        line-height: 1.4;
      `
    case 'medium':
      return css`
        padding: 20px 16px 8px;
        font-size: ${theme.typography.fontSize.base};
        line-height: 1.5;
      `
    case 'large':
      return css`
        padding: 24px 20px 8px;
        font-size: ${theme.typography.fontSize.lg};
        line-height: 1.6;
      `
  }
}

const Container = styled.div`
  width: 100%;
`

const TextareaWrapper = styled.div`
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
  background-color: ${({ theme }) => theme.colors.white};
  transform-origin: left top;
  transition: all 0.2s ease-in-out;

  ${({ isFloating, theme }) =>
    isFloating
      ? css`
          top: -8px;
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

const HelperText = styled.span<{ error?: boolean }>`
  display: block;
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ error, theme }) =>
    error ? theme.colors.error : theme.colors.gray[500]};
`

const StyledTextarea = styled.textarea<{
  height?: TextareaSize
  error?: boolean
  resize?: ResizeOption
  minRows?: number
  maxRows?: number
  hasFloatingLabel?: boolean
}>`
  width: 100%;
  min-height: ${({ height, minRows }) => {
    const lineHeights = { small: 20, medium: 24, large: 29 }
    const paddings = { small: 32, medium: 36, large: 40 }
    const lineHeight = lineHeights[height || 'medium']
    const padding = paddings[height || 'medium']
    return `${(minRows || 3) * lineHeight + padding}px`
  }};
  ${({ maxRows, height }) =>
    maxRows &&
    css`
      max-height: ${(() => {
        const lineHeights = { small: 20, medium: 24, large: 29 }
        const paddings = { small: 32, medium: 36, large: 40 }
        const lineHeight = lineHeights[height || 'medium']
        const padding = paddings[height || 'medium']
        return `${maxRows * lineHeight + padding}px`
      })()};
    `}
  color: ${({ theme }) => theme.colors.black};
  resize: ${({ resize }) => resize || 'vertical'};
  outline: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid
    ${({ error, theme }) =>
      error ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: border-color ${({ theme }) => theme.transition.default};

  ${({ theme, height }) => sizeStyles({ theme, size: height || 'medium' })}

  &:hover:not(:disabled), &:focus {
    border-color: ${({ error, theme }) =>
      error ? theme.colors.error : theme.colors.primary};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.gray[500]};
    pointer-events: none;
    resize: none;
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
    border-radius: ${({ theme }) => theme.borderRadius.default};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[400]};
    border-radius: ${({ theme }) => theme.borderRadius.default};

    &:hover {
      background: ${({ theme }) => theme.colors.gray[500]};
    }
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

Textarea.Label = FloatingLabel
