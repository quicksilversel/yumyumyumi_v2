import { InputHTMLAttributes, DetailedHTMLProps } from 'react'

import styled from '@emotion/styled'

type ToggleSwitchSize = 'small' | 'medium' | 'large'

export interface ToggleSwitchProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type'
  > {
  label?: string
  labelPosition?: 'left' | 'right'
  height?: ToggleSwitchSize
  helperText?: string
  error?: boolean
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export const ToggleSwitch = ({
  label,
  labelPosition = 'right',
  height = 'medium',
  helperText,
  error,
  disabled,
  onChange,
  checked,
  className,
  ...inputProps
}: ToggleSwitchProps) => {
  return (
    <Container className={className}>
      <SwitchLabel disabled={disabled} labelPosition={labelPosition}>
        {label && labelPosition === 'left' && (
          <LabelText height={height}>{label}</LabelText>
        )}
        <SwitchInput
          type="checkbox"
          height={height}
          disabled={disabled}
          {...inputProps}
          onChange={onChange}
          checked={checked}
        />
        {label && labelPosition === 'right' && (
          <LabelText height={height}>{label}</LabelText>
        )}
      </SwitchLabel>
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </Container>
  )
}

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`

const SwitchLabel = styled.label<{
  disabled?: boolean
  labelPosition?: 'left' | 'right'
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  flex-direction: ${({ labelPosition }) =>
    labelPosition === 'left' ? 'row-reverse' : 'row'};
`

const LabelText = styled.span<{ height?: ToggleSwitchSize }>`
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ height, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.base,
      large: theme.typography.fontSize.lg,
    }
    return sizes[height || 'medium']
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
`

const HelperText = styled.span<{ error?: boolean }>`
  color: ${({ error, theme }) =>
    error ? theme.colors.error : theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-top: ${({ theme }) => theme.spacing[1]};
`

const SwitchInput = styled.input<{ height?: ToggleSwitchSize }>`
  position: relative;
  width: ${({ height }) => {
    const widths = { small: '36px', medium: '44px', large: '52px' }
    return widths[height || 'medium']
  }};
  height: ${({ height }) => {
    const heights = { small: '20px', medium: '24px', large: '28px' }
    return heights[height || 'medium']
  }};
  background-color: ${({ theme }) => theme.colors.gray[300]};
  border: 2px solid transparent;
  border-radius: ${({ height }) => {
    const heights = { small: '10px', medium: '12px', large: '14px' }
    return heights[height || 'medium']
  }};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: opacity ${({ theme }) => theme.transition.default};
  outline: none;
  appearance: none;

  &:checked {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:focus-visible {
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.colors.white},
      0 0 0 4px ${({ theme }) => theme.colors.black};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[200]};
    cursor: not-allowed;

    &:checked {
      background-color: ${({ theme }) => theme.colors.gray[400]};
    }
  }

  &::after {
    position: absolute;
    top: ${({ height }) => {
      const tops = { small: '2px', medium: '3px', large: '4px' }
      return tops[height || 'medium']
    }};
    left: ${({ height }) => {
      const lefts = { small: '2px', medium: '3px', large: '4px' }
      return lefts[height || 'medium']
    }};
    width: ${({ height }) => {
      const widths = { small: '14px', medium: '16px', large: '18px' }
      return widths[height || 'medium']
    }};
    height: ${({ height }) => {
      const heights = { small: '14px', medium: '16px', large: '18px' }
      return heights[height || 'medium']
    }};
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform ${({ theme }) => theme.transition.default};
    content: '';
  }

  &:checked::after {
    transform: translateX(
      ${({ height }) => {
        const distances = { small: '16px', medium: '20px', large: '24px' }
        return distances[height || 'medium']
      }}
    );
  }
`
