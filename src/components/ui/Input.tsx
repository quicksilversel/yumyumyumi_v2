import styled from '@emotion/styled'

import {
  colors,
  typography,
  spacing,
  borderRadius,
  transition,
} from '@/styles/designTokens'

export const Input = styled.input<{
  error?: boolean
  fullWidth?: boolean
}>`
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  height: 40px;
  padding: 0 ${spacing[3]};
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize.base};
  color: ${colors.black};
  background-color: ${colors.white};
  border: 1px solid
    ${(props) => (props.error ? colors.error : colors.gray[300])};
  border-radius: ${borderRadius.default};
  transition: all ${transition.default};
  outline: none;

  &::placeholder {
    color: ${colors.gray[400]};
  }

  &:hover:not(:disabled) {
    border-color: ${(props) => (props.error ? colors.error : colors.gray[400])};
  }

  &:focus {
    border-color: ${(props) => (props.error ? colors.error : colors.black)};
  }

  &:disabled {
    background-color: ${colors.gray[50]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const TextArea = styled.textarea<{
  error?: boolean
  fullWidth?: boolean
}>`
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  min-height: 100px;
  padding: ${spacing[3]};
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.normal};
  color: ${colors.black};
  background-color: ${colors.white};
  border: 1px solid
    ${(props) => (props.error ? colors.error : colors.gray[300])};
  border-radius: ${borderRadius.default};
  transition: all ${transition.default};
  outline: none;
  resize: vertical;

  &::placeholder {
    color: ${colors.gray[400]};
  }

  &:hover:not(:disabled) {
    border-color: ${(props) => (props.error ? colors.error : colors.gray[400])};
  }

  &:focus {
    border-color: ${(props) => (props.error ? colors.error : colors.black)};
  }

  &:disabled {
    background-color: ${colors.gray[50]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const Select = styled.select<{
  error?: boolean
  fullWidth?: boolean
}>`
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  height: 40px;
  padding: 0 ${spacing[8]} 0 ${spacing[3]};
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize.base};
  color: ${colors.black};
  background-color: ${colors.white};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23737373' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right ${spacing[2]} center;
  background-repeat: no-repeat;
  background-size: 20px;
  border: 1px solid
    ${(props) => (props.error ? colors.error : colors.gray[300])};
  border-radius: ${borderRadius.default};
  transition: all ${transition.default};
  outline: none;
  appearance: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${(props) => (props.error ? colors.error : colors.gray[400])};
  }

  &:focus {
    border-color: ${(props) => (props.error ? colors.error : colors.black)};
  }

  &:disabled {
    background-color: ${colors.gray[50]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const FormLabel = styled.label`
  display: block;
  margin-bottom: ${spacing[2]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[700]};
`

export const HelperText = styled.span<{
  error?: boolean
}>`
  display: block;
  margin-top: ${spacing[1]};
  font-size: ${typography.fontSize.xs};
  color: ${(props) => (props.error ? colors.error : colors.gray[500])};
`

export const FormField = styled.div`
  margin-bottom: ${spacing[4]};
`
