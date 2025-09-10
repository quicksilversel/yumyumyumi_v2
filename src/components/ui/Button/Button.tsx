import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Theme } from '@emotion/react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text'
type ButtonSize = 'sm' | 'md' | 'lg'

const baseStyles = ({ theme }: { theme: Theme }) => {
  return css`
    position: relative;
    display: inline-flex;
    gap: ${theme.spacing[2]};
    align-items: center;
    justify-content: center;
    font-weight: ${theme.typography.fontWeight.semibold};
    white-space: nowrap;
    text-decoration: none;
    user-select: none;
    transition: opacity ${theme.transition.default};

    &:disabled {
      pointer-events: none;
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
        font-size: ${theme.typography.fontSize.sm};
        border-radius: ${theme.borderRadius.sm};
      `
    case 'md':
      return css`
        height: 40px;
        padding: 0 ${theme.spacing[4]};
        font-size: ${theme.typography.fontSize.base};
        border-radius: ${theme.borderRadius.default};
      `
    case 'lg':
      return css`
        height: 48px;
        padding: 0 ${theme.spacing[6]};
        font-size: ${theme.typography.fontSize.lg};
        border-radius: ${theme.borderRadius.md};
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
        color: ${theme.colors.white};
        background-color: ${theme.colors.primary};
      `
    case 'secondary':
      return css`
        color: ${theme.colors.white};
        background-color: ${theme.colors.black};
      `
    case 'ghost':
      return css`
        color: ${theme.colors.gray[600]};
        background-color: transparent;
        border: 1px solid transparent;
      `
    case 'text':
      return css`
        color: ${theme.colors.black};
        background-color: transparent;
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
  variant?: ButtonVariant
}>`
  ${({ theme }) => {
    return baseStyles({ theme })
  }}

  padding: 0;
  color: ${({ theme }) => theme.colors.gray[600]};
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  &:hover:not(:disabled),
  &:active:not(:disabled) {
    opacity: 0.7;
  }

  ${({ variant, theme }) => {
    return variantStyles({ variant: variant ?? 'ghost', theme })
  }}

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
