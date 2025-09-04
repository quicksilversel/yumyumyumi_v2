import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Theme } from '@emotion/react'

export const Chip = styled.span<{
  variant?: 'filled' | 'outlined'
  size?: 'sm' | 'md'
  clickable?: boolean
  selected?: boolean
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: opacity ${({ theme }) => theme.transition.default};
  white-space: nowrap;
  user-select: none;

  ${({ size, theme }) =>
    size === 'sm'
      ? css`
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
          font-size: ${theme.typography.fontSize.xs};
        `
      : css`
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
        `}

  ${({ variant, selected, theme }) =>
    variant === 'outlined'
      ? css`
          border: 1px solid
            ${selected ? theme.colors.black : theme.colors.gray[300]};
          background-color: transparent;
          color: ${selected ? theme.colors.black : theme.colors.gray[700]};
        `
      : css`
          border: 1px solid transparent;
          background-color: ${selected
            ? theme.colors.black
            : theme.colors.gray[100]};
          color: ${selected ? theme.colors.white : theme.colors.gray[700]};
        `}
  
  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;

      &:hover,
      &:active {
        opacity: 0.8;
      }
    `}
`

export const ChipGroup = styled.div<{
  gap?: keyof Theme['spacing']
}>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme, gap }) => theme.spacing[gap || 2]};
`
