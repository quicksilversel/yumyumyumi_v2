import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

export type SpinnerSize = 'small' | 'medium' | 'large'

export interface SpinnerProps {
  size?: SpinnerSize
  color?: string
  thickness?: number
  speed?: number
  className?: string
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const sizeMap: Record<SpinnerSize, number> = {
  small: 24,
  medium: 40,
  large: 56,
}

const thicknessMap: Record<SpinnerSize, number> = {
  small: 2,
  medium: 3,
  large: 4,
}

const StyledSpinner = styled.div<{
  $size: number
  $color: string
  $thickness: number
  $speed: number
}>`
  border: ${({ $thickness }) => $thickness}px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${({ $color }) => $color};
  border-radius: 50%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  animation: ${spin} ${({ $speed }) => $speed}s linear infinite;
`

export const Spinner = ({
  size = 'medium',
  color = '#333',
  thickness,
  speed = 1,
  className,
}: SpinnerProps) => {
  const pixelSize = sizeMap[size]
  const actualThickness = thickness || thicknessMap[size]

  return (
    <StyledSpinner
      $size={pixelSize}
      $color={color}
      $thickness={actualThickness}
      $speed={speed}
      className={className}
    />
  )
}