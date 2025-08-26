import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, spacing, borderRadius, shadow } from '@/styles/designTokens'

export const Card = styled.div<{
  hoverable?: boolean
  noPadding?: boolean
}>`
  background-color: ${colors.white};
  border: 1px solid ${colors.gray[200]};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  transition: all 200ms ease;

  ${(props) =>
    !props.noPadding &&
    css`
      padding: ${spacing[6]};
    `}

  ${(props) =>
    props.hoverable &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${shadow.md};
        border-color: ${colors.gray[300]};
      }
    `}
`

export const CardMedia = styled.div`
  position: relative;
  width: 100%;
  background-color: ${colors.gray[100]};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 300ms ease;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }
`

export const CardContent = styled.div`
  padding: ${spacing[4]};
`

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[4]};
  padding-top: 0;
`
