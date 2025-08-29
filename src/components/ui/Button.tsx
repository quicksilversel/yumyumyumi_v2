import { css } from '@emotion/react'
import styled from '@emotion/styled'

import {
  colors,
  typography,
  spacing,
  borderRadius,
  transition,
} from '@/styles/designTokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text'
type ButtonSize = 'sm' | 'md' | 'lg'

const baseStyles = css`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: ${spacing[2]};
  border: none;
  font-family: ${typography.fontFamily.sans};
  font-weight: ${typography.fontWeight.medium};
  text-decoration: none;
  cursor: pointer;
  transition: all ${transition.default};
  outline: none;
  white-space: nowrap;
  user-select: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid ${colors.black};
    outline-offset: 2px;
  }
`

const sizeStyles = {
  sm: css`
    height: 32px;
    padding: 0 ${spacing[3]};
    border-radius: ${borderRadius.sm};
    font-size: ${typography.fontSize.sm};
  `,
  md: css`
    height: 40px;
    padding: 0 ${spacing[4]};
    border-radius: ${borderRadius.default};
    font-size: ${typography.fontSize.base};
  `,
  lg: css`
    height: 48px;
    padding: 0 ${spacing[6]};
    border-radius: ${borderRadius.md};
    font-size: ${typography.fontSize.lg};
  `,
}

const variantStyles = {
  primary: css`
    background-color: ${colors.black};
    color: ${colors.white};

    &:hover:not(:disabled) {
      background-color: ${colors.gray[800]};
    }

    &:active:not(:disabled) {
      background-color: ${colors.gray[900]};
    }
  `,
  secondary: css`
    border: 1px solid ${colors.gray[300]};
    background-color: ${colors.white};
    color: ${colors.black};

    &:hover:not(:disabled) {
      border-color: ${colors.gray[400]};
      background-color: ${colors.gray[50]};
    }

    &:active:not(:disabled) {
      background-color: ${colors.gray[100]};
    }
  `,
  ghost: css`
    border: 1px solid transparent;
    background-color: transparent;
    color: ${colors.black};

    &:hover:not(:disabled) {
      background-color: ${colors.gray[50]};
    }

    &:active:not(:disabled) {
      background-color: ${colors.gray[100]};
    }
  `,
  text: css`
    height: auto;
    padding: 0;
    border-radius: 0;
    background-color: transparent;
    color: ${colors.black};

    &:hover:not(:disabled) {
      opacity: 0.7;
    }

    &:active:not(:disabled) {
      opacity: 0.5;
    }
  `,
}

export const Button = styled.button<{
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}>`
  ${baseStyles}
  ${(props) => sizeStyles[props.size || 'md']}
  ${(props) => variantStyles[props.variant || 'primary']}
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}
`

export const IconButton = styled.button<{
  size?: ButtonSize
}>`
  ${baseStyles}
  padding: 0;
  background-color: transparent;
  border-radius: ${borderRadius.full};
  color: ${colors.gray[600]};

  ${(props) =>
    props.size === 'sm' &&
    css`
      width: 32px;
      height: 32px;
      font-size: 18px;
    `}

  ${(props) =>
    props.size === 'md' &&
    css`
      width: 40px;
      height: 40px;
      font-size: 20px;
    `}
  
  ${(props) =>
    props.size === 'lg' &&
    css`
      width: 48px;
      height: 48px;
      font-size: 24px;
    `}
  
  &:hover:not(:disabled) {
    background-color: ${colors.gray[50]};
    color: ${colors.black};
  }

  &:active:not(:disabled) {
    background-color: ${colors.gray[100]};
  }
`
