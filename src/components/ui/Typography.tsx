import styled from '@emotion/styled'

import { colors, typography, transition } from '@/styles/designTokens'

export const H1 = styled.h1`
  margin: 0;
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  line-height: ${typography.lineHeight.tight};
  letter-spacing: ${typography.letterSpacing.tight};
  color: ${colors.black};
`

export const H2 = styled.h2`
  margin: 0;
  font-size: ${typography.fontSize['xl']};
  font-weight: ${typography.fontWeight.bold};
  line-height: ${typography.lineHeight.tight};
  letter-spacing: ${typography.letterSpacing.tight};
  color: ${colors.black};
`

export const H3 = styled.h3`
  margin: 0;
  font-size: ${typography.fontSize['base']};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.tight};
  color: ${colors.black};
`

export const H4 = styled.h4`
  margin: 0;
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.normal};
  color: ${colors.black};
`

export const H5 = styled.h5`
  margin: 0;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.normal};
  color: ${colors.black};
`

export const H6 = styled.h6`
  margin: 0;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  line-height: ${typography.lineHeight.normal};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wider};
  color: ${colors.gray[600]};
`

export const Body = styled('p', {
  shouldForwardProp: (prop) => prop !== 'muted',
})<{
  size?: 'sm' | 'base' | 'lg'
  muted?: boolean
}>`
  margin: 0;
  font-size: ${(props) => typography.fontSize[props.size || 'base']};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.relaxed};
  color: ${(props) => (props.muted ? colors.gray[600] : colors.black)};
`

export const Caption = styled.span`
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.normal};
  color: ${colors.gray[500]};
`

export const Label = styled.span`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.normal};
  color: ${colors.gray[700]};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
`

export const Link = styled.a`
  color: ${colors.black};
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity ${transition.default};
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`
