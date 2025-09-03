import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { spacing } from '@/styles/designTokens'

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
  transition: all ${({ theme }) => theme.transition.default};
  white-space: nowrap;
  user-select: none;

  ${(props) =>
    props.size === 'sm'
      ? css`
          padding: ${props.theme.spacing[1]} ${props.theme.spacing[2]};
          font-size: ${props.theme.typography.fontSize.xs};
        `
      : css`
          padding: ${props.theme.spacing[2]} ${props.theme.spacing[3]};
          font-size: ${props.theme.typography.fontSize.sm};
        `}

  ${(props) =>
    props.variant === 'outlined'
      ? css`
          border: 1px solid
            ${props.selected
              ? props.theme.colors.black
              : props.theme.colors.gray[300]};
          background-color: transparent;
          color: ${props.selected
            ? props.theme.colors.black
            : props.theme.colors.gray[700]};
        `
      : css`
          border: 1px solid transparent;
          background-color: ${props.selected
            ? props.theme.colors.black
            : props.theme.colors.gray[100]};
          color: ${props.selected
            ? props.theme.colors.white
            : props.theme.colors.gray[700]};
        `}
  
  ${(props) =>
    props.clickable &&
    css`
      cursor: pointer;

      &:hover {
        ${props.variant === 'outlined'
          ? css`
              border-color: ${props.theme.colors.gray[400]};
              background-color: ${props.theme.colors.gray[50]};
            `
          : css`
              background-color: ${props.selected
                ? props.theme.colors.gray[800]
                : props.theme.colors.gray[200]};
            `}
      }

      &:active {
        transform: scale(0.95);
      }
    `}
`

export const ChipGroup = styled.div<{
  gap?: keyof typeof spacing
}>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme, gap }) => theme.spacing[gap || 2]};
`
