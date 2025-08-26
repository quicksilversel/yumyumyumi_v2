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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  font-family: ${typography.fontFamily.sans};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  border: none;
  outline: none;
  transition: all ${transition.default};
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    font-size: ${typography.fontSize.sm};
    border-radius: ${borderRadius.sm};
  `,
  md: css`
    height: 40px;
    padding: 0 ${spacing[4]};
    font-size: ${typography.fontSize.base};
    border-radius: ${borderRadius.default};
  `,
  lg: css`
    height: 48px;
    padding: 0 ${spacing[6]};
    font-size: ${typography.fontSize.lg};
    border-radius: ${borderRadius.md};
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
    background-color: ${colors.white};
    color: ${colors.black};
    border: 1px solid ${colors.gray[300]};

    &:hover:not(:disabled) {
      background-color: ${colors.gray[50]};
      border-color: ${colors.gray[400]};
    }

    &:active:not(:disabled) {
      background-color: ${colors.gray[100]};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${colors.black};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${colors.gray[50]};
    }

    &:active:not(:disabled) {
      background-color: ${colors.gray[100]};
    }
  `,
  text: css`
    background-color: transparent;
    color: ${colors.black};
    padding: 0;
    height: auto;
    border-radius: 0;

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
  background-color: transparent;
  color: ${colors.gray[600]};
  padding: 0;
  border-radius: ${borderRadius.full};

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
