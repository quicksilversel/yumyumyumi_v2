import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, spacing, breakpoints } from '@/styles/designTokens'

export const Container = styled.div<{
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  noPadding?: boolean
}>`
  width: 100%;
  margin: 0 auto;

  ${(props) =>
    !props.noPadding &&
    css`
      padding: 0 ${spacing[4]};

      @media (min-width: ${breakpoints.md}) {
        padding: 0 ${spacing[6]};
      }

      @media (min-width: ${breakpoints.lg}) {
        padding: 0 ${spacing[8]};
      }
    `}

  ${(props) => {
    const widths = {
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
      '2xl': breakpoints['2xl'],
      full: '100%',
    }
    const maxWidth = widths[props.maxWidth || 'xl']
    return maxWidth !== '100%'
      ? css`
          max-width: ${maxWidth};
        `
      : ''
  }}
`

export const Grid = styled.div<{
  cols?: number
  gap?: keyof typeof spacing
  responsive?: boolean
}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.cols || 1}, 1fr);
  gap: ${(props) => spacing[props.gap || 4]};

  ${(props) =>
    props.responsive &&
    css`
      @media (max-width: ${breakpoints.sm}) {
        grid-template-columns: repeat(1, 1fr);
      }

      @media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md}) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg}) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: ${breakpoints.lg}) {
        grid-template-columns: repeat(${props.cols || 4}, 1fr);
      }
    `}
`

export const Flex = styled.div<{
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: keyof typeof spacing
  wrap?: boolean
}>`
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => {
    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    }
    return alignMap[props.align || 'start']
  }};
  justify-content: ${(props) => {
    const justifyMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    }
    return justifyMap[props.justify || 'start']
  }};
  gap: ${(props) => spacing[props.gap || 0]};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'nowrap')};
`

export const Stack = styled(Flex)`
  flex-direction: column;
`

export const Divider = styled.div<{
  vertical?: boolean
  spacing?: keyof typeof spacing
}>`
  background-color: ${colors.gray[200]};

  ${(props) =>
    props.vertical
      ? css`
          width: 1px;
          height: 100%;
          margin: 0 ${spacing[props.spacing || 4]};
        `
      : css`
          width: 100%;
          height: 1px;
          margin: ${spacing[props.spacing || 4]} 0;
        `}
`

export const Spacer = styled.div<{
  size?: keyof typeof spacing
}>`
  flex: 1;
  ${(props) =>
    props.size &&
    css`
      flex: none;
      width: ${spacing[props.size]};
      height: ${spacing[props.size]};
    `}
`
