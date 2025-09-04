import type { Meta, StoryObj } from '@storybook/react'

import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Forms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'number', 'email', 'password', 'tel', 'url', 'search'],
    },
    height: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    title: {
      control: { type: 'text' },
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

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
    height: 'medium',
  },
}

export const WithValue: Story = {
  args: {
    placeholder: 'Enter text...',
    value: 'Sample text',
    type: 'text',
    height: 'medium',
  },
}

export const Small: Story = {
  args: {
    placeholder: 'Small input',
    height: 'small',
  },
}

export const Medium: Story = {
  args: {
    placeholder: 'Medium input',
    height: 'medium',
  },
}

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    height: 'large',
  },
}

export const TextInput: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
}

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number...',
    min: 0,
    max: 100,
    step: 1,
  },
}

export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email...',
  },
}

export const PasswordInput: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
}

export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
}

export const TelInput: Story = {
  args: {
    type: 'tel',
    placeholder: 'Enter phone number...',
  },
}

export const UrlInput: Story = {
  args: {
    type: 'url',
    placeholder: 'Enter URL...',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit this',
  },
}

export const Error: Story = {
  args: {
    placeholder: 'Enter email...',
    error: true,
    value: 'invalid-email',
  },
}

export const Required: Story = {
  args: {
    placeholder: 'Required field',
    required: true,
  },
}

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
      <Input height="small" placeholder="Small input" />
      <Input height="medium" placeholder="Medium input" />
      <Input height="large" placeholder="Large input" />
    </div>
  ),
}

export const AllTypes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '320px',
      }}
    >
      <Input type="text" placeholder="Text input" />
      <Input type="number" placeholder="Number input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="search" placeholder="Search input" />
      <Input type="tel" placeholder="Phone input" />
      <Input type="url" placeholder="URL input" />
    </div>
  ),
}

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
      <Input placeholder="Normal input" />
      <Input placeholder="Disabled input" disabled value="Disabled" />
      <Input placeholder="Error input" value="Error state" />
      <Input placeholder="Required input" required />
    </div>
  ),
}

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
          htmlFor="name"
          style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}
        >
          Name *
        </label>
        <Input id="name" type="text" placeholder="Enter your name" required />
      </div>
      <div>
        <label
          htmlFor="email"
          style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}
        >
          Email *
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label
          htmlFor="age"
          style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}
        >
          Age
        </label>
        <Input
          id="age"
          type="number"
          placeholder="Enter your age"
          min={1}
          max={120}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}
        >
          Password *
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          required
        />
      </div>
    </form>
  ),
}
