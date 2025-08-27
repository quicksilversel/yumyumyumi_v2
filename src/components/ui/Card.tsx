import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const Card = styled.div<{
  hoverable?: boolean
  noPadding?: boolean
}>`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: all 200ms ease;

  ${({ theme, noPadding }) =>
    !noPadding &&
    css`
      padding: ${theme.spacing[6]};
    `}

  ${({ theme, hoverable }) =>
    hoverable &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadow.md};
        border-color: ${theme.colors.gray[300]};
      }
    `}
`

export const CardMedia = styled.div`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray[100]};
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
  padding: ${({ theme }) => theme.spacing[4]};
`

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  padding-top: 0;
`
