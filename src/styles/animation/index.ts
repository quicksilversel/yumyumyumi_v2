import { keyframes } from '@emotion/react'

export const scaleAnimation = () => keyframes`
  0% {
    transform: scale(1) rotate(15deg);
  }
  50% {
    transform: scale(1.05) rotate(15deg);
  }
  100% {
    transform: scale(1) rotate(15deg);
  }
`

export const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const floatAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0px);
  }
`
