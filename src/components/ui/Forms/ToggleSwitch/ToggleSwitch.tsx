import { InputHTMLAttributes, DetailedHTMLProps } from 'react'

import styled from '@emotion/styled'

type ToggleSwitchSize = 'small' | 'medium' | 'large'

export interface ToggleSwitchProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type' | 'size'
  > {
  label?: string
  labelPosition?: 'left' | 'right'
  size?: ToggleSwitchSize
  helperText?: string
  error?: boolean
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ToggleSwitch = ({
  label,
  labelPosition = 'right',
  size = 'medium',
  helperText,
  error,
  disabled,
  onChange,
  checked,
  ...inputProps
}: ToggleSwitchProps) => {
  return (
    <Container>
      <SwitchLabel disabled={disabled} labelPosition={labelPosition}>
        {label && labelPosition === 'left' && (
          <LabelText size={size}>{label}</LabelText>
        )}
        <SwitchInput
          type="checkbox"
          size={size}
          disabled={disabled}
          {...inputProps}
          onChange={onChange}
          checked={checked}
        />
        {label && labelPosition === 'right' && (
          <LabelText size={size}>{label}</LabelText>
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
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  flex-direction: ${(props) =>
    props.labelPosition === 'left' ? 'row-reverse' : 'row'};
`

const LabelText = styled.span<{ size?: ToggleSwitchSize }>`
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${(props) => {
    const sizes = {
      small: props.theme.typography.fontSize.sm,
      medium: props.theme.typography.fontSize.base,
      large: props.theme.typography.fontSize.lg,
    }
    return sizes[props.size || 'medium']
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
`

const HelperText = styled.span<{ error?: boolean }>`
  color: ${(props) =>
    props.error ? props.theme.colors.error : props.theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-left: ${({ theme }) => theme.spacing[1]};
`

const SwitchInput = styled.input<{ size?: ToggleSwitchSize }>`
  position: relative;
  width: ${(props) => {
    const widths = { small: '36px', medium: '44px', large: '52px' }
    return widths[props.size || 'medium']
  }};
  height: ${(props) => {
    const heights = { small: '20px', medium: '24px', large: '28px' }
    return heights[props.size || 'medium']
  }};
  background-color: ${({ theme }) => theme.colors.gray[300]};
  border: 2px solid transparent;
  border-radius: ${(props) => {
    const heights = { small: '10px', medium: '12px', large: '14px' }
    return heights[props.size || 'medium']
  }};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all ${({ theme }) => theme.transition.default};
  outline: none;
  appearance: none;

  &:checked {
    background-color: ${({ theme }) => theme.colors.black};
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[400]};

    &:checked {
      background-color: ${({ theme }) => theme.colors.gray[800]};
    }
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
    top: ${(props) => {
      const tops = { small: '2px', medium: '3px', large: '4px' }
      return tops[props.size || 'medium']
    }};
    left: ${(props) => {
      const lefts = { small: '2px', medium: '3px', large: '4px' }
      return lefts[props.size || 'medium']
    }};
    width: ${(props) => {
      const widths = { small: '14px', medium: '16px', large: '18px' }
      return widths[props.size || 'medium']
    }};
    height: ${(props) => {
      const heights = { small: '14px', medium: '16px', large: '18px' }
      return heights[props.size || 'medium']
    }};
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform ${({ theme }) => theme.transition.default};
    content: '';
  }

  &:checked::after {
    transform: translateX(
      ${(props) => {
        const distances = { small: '16px', medium: '20px', large: '24px' }
        return distances[props.size || 'medium']
      }}
    );
  }
`
