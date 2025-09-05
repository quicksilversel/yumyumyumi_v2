import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Theme } from '@emotion/react'

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
  height = 'small',
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

const sizeStyles = ({ size, theme }: { size: SelectSize; theme: Theme }) => {
  switch (size) {
    case 'small':
      return css`
        height: 32px;
        padding: 0 ${theme.spacing[8]} 0 ${theme.spacing[3]};
        font-size: ${theme.typography.fontSize.sm};
      `
    case 'medium':
      return css`
        height: 40px;
        padding: 0 ${theme.spacing[10]} 0 ${theme.spacing[4]};
        font-size: ${theme.typography.fontSize.base};
      `
    case 'large':
      return css`
        height: 48px;
        padding: 0 ${theme.spacing[12]} 0 ${theme.spacing[5]};
        font-size: ${theme.typography.fontSize.lg};
      `
  }
}

const Container = styled.div`
  width: 100%;
`

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
`

const StyledSelect = styled.select<Partial<SelectProps>>`
  width: ${({ fullWidth }) => (fullWidth !== false ? '100%' : 'auto')};
  border: 1px solid
    ${({ error, theme }) =>
      error ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.colors.white};
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing['3']} center;
  color: ${({ theme }) => theme.colors.black};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transition.default};
  transition-property: border-color, box-shadow;
  outline: none;
  appearance: none;

  ${({ height, theme }) =>
    sizeStyles({
      size: height ?? 'medium',
      theme,
    })}

  &:hover:not(:disabled) {
    border-color: ${({ error, theme }) =>
      error ? theme.colors.error : theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${({ error, theme }) =>
      error ? theme.colors.error : theme.colors.black};
    box-shadow: 0 0 0 1px
      ${({ error, theme }) => (error ? theme.colors.error : theme.colors.black)};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
    opacity: 0.6;
  }

  option {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};

    &:disabled {
      color: ${({ theme }) => theme.colors.gray[400]};
    }
  }
`
