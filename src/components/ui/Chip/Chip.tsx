import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Theme } from '@emotion/react'

const chipStyles = ({
  variant,
  selected,
  theme,
}: {
  variant: 'filled' | 'outlined' | 'accent'
  selected: boolean
  theme: Theme
}) => {
  switch (variant) {
    case 'outlined':
      return css`
        border: 1px solid
          ${selected ? theme.colors.black : theme.colors.gray[300]};
        background-color: transparent;
        color: ${selected ? theme.colors.black : theme.colors.gray[700]};
      `
    case 'accent':
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
      `
    default:
      return css`
        border: 1px solid transparent;
        background-color: ${selected
          ? theme.colors.black
          : theme.colors.gray[100]};
        color: ${selected ? theme.colors.white : theme.colors.gray[700]};
      `
  }
}

export const Chip = styled.span<{
  variant?: 'filled' | 'outlined' | 'accent'
  size?: 'sm' | 'md'
  clickable?: boolean
  selected?: boolean
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${(props) => props.theme.typography.fontWeight.semibold};
  transition: opacity ${({ theme }) => theme.transition.default};
  white-space: nowrap;
  user-select: none;

  ${({ variant, selected, theme }) =>
    chipStyles({ variant: variant ?? 'filled', selected: !!selected, theme })}

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
