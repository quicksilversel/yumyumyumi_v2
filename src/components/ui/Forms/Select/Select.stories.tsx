import type { Meta, StoryObj } from '@storybook/react'

import { Select } from './Select'

const meta: Meta<typeof Select> = {
  title: 'Components/Forms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    placeholder: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
    required: {
      control: { type: 'boolean' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// Sample options
const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'strawberry', label: 'Strawberry' },
]

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'South Korea' },
]

const sizeOptions = [
  { value: 'xs', label: 'Extra Small' },
  { value: 's', label: 'Small' },
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
]

// Basic Select Stories
export const Default: Story = {
  args: {
    placeholder: 'Select an option...',
    options: fruitOptions,
    height: 'medium',
  },
}

export const WithValue: Story = {
  args: {
    placeholder: 'Select a fruit...',
    options: fruitOptions,
    value: 'banana',
    height: 'medium',
  },
}

// Size Variants
export const Small: Story = {
  args: {
    placeholder: 'Small select',
    options: fruitOptions,
    height: 'small',
  },
}

export const Medium: Story = {
  args: {
    placeholder: 'Medium select',
    options: fruitOptions,
    height: 'medium',
  },
}

export const Large: Story = {
  args: {
    placeholder: 'Large select',
    options: fruitOptions,
    height: 'large',
  },
}

// State Stories
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled select',
    options: fruitOptions,
    disabled: true,
    value: 'apple',
  },
}

export const Error: Story = {
  args: {
    placeholder: 'Select with error',
    options: fruitOptions,
    error: true,
  },
}

export const Required: Story = {
  args: {
    placeholder: 'Required selection',
    options: fruitOptions,
    required: true,
  },
}

// With Disabled Options
export const WithDisabledOptions: Story = {
  args: {
    placeholder: 'Some options disabled',
    options: [
      { value: 'active1', label: 'Active Option 1' },
      { value: 'disabled1', label: 'Disabled Option 1', disabled: true },
      { value: 'active2', label: 'Active Option 2' },
      { value: 'disabled2', label: 'Disabled Option 2', disabled: true },
      { value: 'active3', label: 'Active Option 3' },
    ],
  },
}

// All Sizes Demo
export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '320px',
      }}
    >
      <Select
        height="small"
        placeholder="Small select"
        options={fruitOptions}
      />
      <Select
        height="medium"
        placeholder="Medium select"
        options={fruitOptions}
      />
      <Select
        height="large"
        placeholder="Large select"
        options={fruitOptions}
      />
    </div>
  ),
}

// State Variations Demo
export const StateVariations: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '320px',
      }}
    >
      <Select placeholder="Normal select" options={fruitOptions} />
      <Select
        placeholder="Disabled select"
        options={fruitOptions}
        disabled
        value="apple"
      />
      <Select placeholder="Error select" options={fruitOptions} error />
      <Select placeholder="Required select" options={fruitOptions} required />
    </div>
  ),
}

// Different Option Sets
export const DifferentOptionSets: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '320px',
      }}
    >
      <Select placeholder="Select a fruit..." options={fruitOptions} />
      <Select placeholder="Select a country..." options={countryOptions} />
      <Select placeholder="Select a height..." options={sizeOptions} />
    </div>
  ),
}

// Interactive Form Example
export const FormExample: Story = {
  render: () => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '320px',
      }}
    >
      <div>
        <label
          htmlFor="country"
          style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}
        >
          Country *
        </label>
        <Select
          id="country"
          placeholder="Select your country"
          options={countryOptions}
          required
        />
      </div>
      <div>
        <label
          htmlFor="fruit"
          style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}
        >
          Favorite Fruit
        </label>
        <Select
          id="fruit"
          placeholder="Select your favorite fruit"
          options={fruitOptions}
        />
      </div>
      <div>
        <label
          htmlFor="height"
          style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}
        >
          T-Shirt Size *
        </label>
        <Select
          id="height"
          placeholder="Select height"
          options={sizeOptions}
          required
        />
      </div>
    </form>
  ),
}

// Long List Example
export const LongList: Story = {
  args: {
    placeholder: 'Select a number...',
    options: Array.from({ length: 20 }, (_, i) => ({
      value: i + 1,
      label: `Option ${i + 1}`,
    })),
  },
}

// Width Variations
export const FullWidth: Story = {
  args: {
    placeholder: 'Full width select',
    options: fruitOptions,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
}

export const AutoWidth: Story = {
  args: {
    placeholder: 'Auto width',
    options: fruitOptions,
    fullWidth: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'auto' }}>
        <Story />
      </div>
    ),
  ],
}
