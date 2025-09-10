import styled from '@emotion/styled'

export const H1 = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.black};
`

export const H2 = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
`

export const H3 = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize['lg']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  color: ${({ theme }) => theme.colors.black};
`

export const Body = styled('p', {
  shouldForwardProp: (prop) => prop !== 'muted',
})<{
  size?: 'sm' | 'base' | 'lg'
  muted?: boolean
}>`
  margin: 0;
  font-size: ${({ theme, size }) => theme.typography.fontSize[size || 'base']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ muted, theme }) =>
    muted ? theme.colors.gray[600] : theme.colors.black};
  white-space: pre-wrap;
`

export const Caption = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.gray[500]};
`

export const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`

export const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
`
