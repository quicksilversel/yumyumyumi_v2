import { TextareaHTMLAttributes, DetailedHTMLProps } from 'react'

import { css } from '@emotion/react'
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
  height?: TextareaSize
  error?: boolean
  helperText?: string
  resize?: ResizeOption
  minRows?: number
  maxRows?: number
}

export const Textarea = ({
  title,
  height = 'small',
  error,
  helperText,
  resize = 'vertical',
  minRows = 3,
  maxRows,
  ...textareaProps
}: TextareaProps) => {
  const isEmpty =
    textareaProps.value === '' ||
    textareaProps.value === null ||
    textareaProps.value === undefined
  const hasError = !!error || (textareaProps.required && isEmpty)

  return (
    <Container>
      {title && (
        <Label htmlFor={textareaProps.id}>
          {title}
          {textareaProps.required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      <StyledTextarea
        height={height}
        error={hasError}
        resize={resize}
        minRows={minRows}
        maxRows={maxRows}
        {...textareaProps}
      />
      {helperText && <HelperText error={hasError}>{helperText}</HelperText>}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
`

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

const RequiredMark = styled.span`
  margin-left: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.error};
`

const HelperText = styled.span<{ error?: boolean }>`
  display: block;
  margin-top: ${({ theme }) => theme.spacing[1]};
  color: ${({ error, theme }) =>
    error ? theme.colors.error : theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`

const sizeStyles = {
  small: css`
    padding: 8px 12px;
    font-size: 14px;
    line-height: 1.4;
  `,
  medium: css`
    padding: 10px 16px;
    font-size: 16px;
    line-height: 1.5;
  `,
  large: css`
    padding: 12px 20px;
    font-size: 18px;
    line-height: 1.6;
  `,
}

const StyledTextarea = styled.textarea<{
  height?: TextareaSize
  error?: boolean
  resize?: ResizeOption
  minRows?: number
  maxRows?: number
}>`
  width: 100%;
  min-height: ${({ height, minRows }) => {
    const lineHeights = { small: 20, medium: 24, large: 29 }
    const paddings = { small: 16, medium: 20, large: 24 }
    const lineHeight = lineHeights[height || 'medium']
    const padding = paddings[height || 'medium']
    return `${(minRows || 3) * lineHeight + padding}px`
  }};
  ${({ maxRows, height }) =>
    maxRows &&
    css`
      max-height: ${(() => {
        const lineHeights = { small: 20, medium: 24, large: 29 }
        const paddings = { small: 16, medium: 20, large: 24 }
        const lineHeight = lineHeights[height || 'medium']
        const padding = paddings[height || 'medium']
        return `${maxRows * lineHeight + padding}px`
      })()};
    `}
  border: 1px solid
    ${({ error, theme }) =>
    error ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  resize: ${({ resize }) => resize || 'vertical'};
  transition: border-color ${({ theme }) => theme.transition.default};
  transition-property: border-color, box-shadow;
  outline: none;

  ${({ height }) => sizeStyles[height || 'medium']}

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:hover:not(:disabled) {
    border-color: ${({ error, theme }) =>
      error ? theme.colors.error : theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${({ error, theme }) =>
      error ? theme.colors.error : theme.colors.black};
    box-shadow: 0 0 0 1px
      ${({ error, theme }) => (error ? theme.colors.error : theme.colors.black)};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
    resize: none;
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
`
