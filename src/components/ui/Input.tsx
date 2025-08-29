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
  border: 1px solid
    ${(props) => (props.error ? colors.error : colors.gray[300])};
  border-radius: ${borderRadius.default};
  background-color: ${colors.white};
  color: ${colors.black};
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize.base};
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
  border: 1px solid
    ${(props) => (props.error ? colors.error : colors.gray[300])};
  border-radius: ${borderRadius.default};
  background-color: ${colors.white};
  color: ${colors.black};
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.normal};
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
  border: 1px solid
    ${(props) => (props.error ? colors.error : colors.gray[300])};
  border-radius: ${borderRadius.default};
  background-color: ${colors.white};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23737373' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right ${spacing[2]} center;
  background-size: 20px;
  color: ${colors.black};
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize.base};
  cursor: pointer;
  transition: all ${transition.default};
  background-repeat: no-repeat;
  outline: none;
  appearance: none;

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
  color: ${colors.gray[700]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
`

export const HelperText = styled.span<{
  error?: boolean
}>`
  display: block;
  margin-top: ${spacing[1]};
  color: ${(props) => (props.error ? colors.error : colors.gray[500])};
  font-size: ${typography.fontSize.xs};
`

export const FormField = styled.div`
  width: 100%;
  margin-bottom: ${spacing[4]};
`
