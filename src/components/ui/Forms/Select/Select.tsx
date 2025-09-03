import { css } from '@emotion/react'
import styled from '@emotion/styled'

import {
  colors,
  typography,
  spacing,
  borderRadius,
  transition,
} from '@/styles/designTokens'

type SelectSize = 'small' | 'medium' | 'large'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps {
  title?: string
  height?: SelectSize
  placeholder?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  disabled?: boolean
  error?: boolean
  fullWidth?: boolean
  className?: string
  name?: string
  id?: string
  required?: boolean
}

export const Select = ({
  title,
  height = 'medium',
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
  error = false,
  fullWidth = true,
  className,
  name,
  id,
  required = false,
}: SelectProps) => {
  return (
    <Container>
      {title && (
        <Label htmlFor={id}>
          {title}
          {required && '*'}
        </Label>
      )}
      <StyledSelect
        height={height}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={error}
        fullWidth={fullWidth}
        className={className}
        name={name}
        id={id}
        required={required}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </Container>
  )
}

const sizeStyles = {
  small: css`
    height: 32px;
    padding: 0 ${spacing[8]} 0 ${spacing[3]};
    font-size: ${typography.fontSize.sm};
  `,
  medium: css`
    height: 40px;
    padding: 0 ${spacing[10]} 0 ${spacing[4]};
    font-size: ${typography.fontSize.base};
  `,
  large: css`
    height: 48px;
    padding: 0 ${spacing[12]} 0 ${spacing[5]};
    font-size: ${typography.fontSize.lg};
  `,
}

const Container = styled.div`
  width: 100%;
`

const Label = styled.label`
  display: block;
  margin-bottom: ${spacing[1]};
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[800]};
`

const StyledSelect = styled.select<Partial<SelectProps>>`
  width: ${(props) => (props.fullWidth !== false ? '100%' : 'auto')};
  border: 1px solid
    ${(props) => (props.error ? colors.error : colors.gray[300])};
  border-radius: ${borderRadius.default};
  background-color: ${colors.white};
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${spacing[3]} center;
  color: ${colors.black};
  font-family: ${typography.fontFamily.sans};
  cursor: pointer;
  transition: all ${transition.default};
  outline: none;
  appearance: none;

  ${(props) => sizeStyles[props.height || 'medium']}

  &:hover:not(:disabled) {
    border-color: ${(props) => (props.error ? colors.error : colors.gray[400])};
  }

  &:focus {
    border-color: ${(props) => (props.error ? colors.error : colors.black)};
    box-shadow: 0 0 0 1px
      ${(props) => (props.error ? colors.error : colors.black)};
  }

  &:disabled {
    background-color: ${colors.gray[50]};
    color: ${colors.gray[500]};
    cursor: not-allowed;
    opacity: 0.6;
  }

  option {
    color: ${colors.black};
    background-color: ${colors.white};

    &:disabled {
      color: ${colors.gray[400]};
    }
  }
`
