import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Theme } from '@emotion/react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text'
type ButtonSize = 'sm' | 'md' | 'lg'

const baseStyles = ({ theme }: { theme: Theme }) => {
  return css`
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: ${theme.spacing[2]};
    font-weight: ${theme.typography.fontWeight.medium};
    text-decoration: none;
    transition: opacity ${theme.transition.default};
    white-space: nowrap;
    user-select: none;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &:focus-visible {
      outline: 2px solid ${theme.colors.black};
      outline-offset: 2px;
    }

    &:hover:not(:disabled),
    &:active:not(:disabled) {
      opacity: 0.7;
    }
  `
}

const sizeStyles = ({ size, theme }: { size: ButtonSize; theme: Theme }) => {
  switch (size) {
    case 'sm':
      return css`
        height: 32px;
        padding: 0 ${theme.spacing[3]};
        border-radius: ${theme.borderRadius.sm};
        font-size: ${theme.typography.fontSize.sm};
      `
    case 'md':
      return css`
        height: 40px;
        padding: 0 ${theme.spacing[4]};
        border-radius: ${theme.borderRadius.default};
        font-size: ${theme.typography.fontSize.base};
      `
    case 'lg':
      return css`
        height: 48px;
        padding: 0 ${theme.spacing[6]};
        border-radius: ${theme.borderRadius.md};
        font-size: ${theme.typography.fontSize.lg};
      `
  }
}

const variantStyles = ({
  variant,
  theme,
}: {
  variant: ButtonVariant
  theme: Theme
}) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
      `
    case 'secondary':
      return css`
        background-color: ${theme.colors.black};
        color: ${theme.colors.white};
      `
    case 'ghost':
      return css`
        border: 1px solid transparent;
        background-color: transparent;
        color: ${theme.colors.black};
      `
    case 'text':
      return css`
        background-color: transparent;
        color: ${theme.colors.black};
      `
  }
}

export const Button = styled.button<{
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}>`
  ${({ theme }) => {
    return baseStyles({ theme })
  }}

  ${({ size, theme }) => {
    return sizeStyles({ size: size ?? 'md', theme })
  }}

  ${({ variant, theme }) => {
    return variantStyles({ variant: variant ?? 'primary', theme })
  }}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`

export const IconButton = styled.button<{
  size?: ButtonSize
}>`
  ${({ theme }) => {
    return baseStyles({ theme })
  }}

  padding: 0;
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.gray[600]};

  &:hover:not(:disabled),
  &:active:not(:disabled) {
    opacity: 0.7;
  }

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`
          width: 32px;
          height: 32px;
          font-size: 18px;
        `
      case 'md':
        return css`
          width: 40px;
          height: 40px;
          font-size: 20px;
        `
      case 'lg':
        return css`
          width: 48px;
          height: 48px;
          font-size: 24px;
        `
    }
  }}
`
