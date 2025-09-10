import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import SearchIcon from '@mui/icons-material/Search'
import { fn } from 'storybook/test'

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
      <div style={{ width: '320px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
    height: 'medium',
    onChange: fn(),
  },
}

export const WithFloatingLabel: Story = {
  args: {
    title: 'Username',
    placeholder: 'Enter username',
    type: 'text',
    height: 'medium',
    onChange: fn(),
  },
}

export const WithValue: Story = {
  args: {
    title: 'Email',
    placeholder: 'Enter email',
    value: 'user@example.com',
    type: 'email',
    height: 'medium',
    onChange: fn(),
  },
}

export const WithIcon: Story = {
  args: {
    title: 'Email',
    icon: <EmailIcon fontSize="small" />,
    placeholder: 'Enter your email',
    type: 'email',
    height: 'medium',
    onChange: fn(),
  },
}

export const WithHelperText: Story = {
  args: {
    title: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    height: 'medium',
    onChange: fn(),
  },
}

export const Required: Story = {
  args: {
    title: 'Required Field',
    placeholder: 'This field is required',
    required: true,
    height: 'medium',
    onChange: fn(),
  },
}

export const Error: Story = {
  args: {
    title: 'Email',
    placeholder: 'Enter email',
    value: 'invalid-email',
    error: true,
    height: 'medium',
    onChange: fn(),
  },
}

export const Disabled: Story = {
  args: {
    title: 'Disabled Input',
    placeholder: 'Cannot edit',
    disabled: true,
    value: 'Disabled value',
    height: 'medium',
    onChange: fn(),
  },
}

export const AutofillSimulation: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '320px',
      }}
    >
      <style>
        {`
          .autofill-simulation input {
            background-color: #e8f0fe !important;
            color: #202124 !important;
          }
        `}
      </style>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Autofilled Email (CSS simulation)
        </p>
        <div className="autofill-simulation">
          <Input
            title="Email Address"
            icon={<EmailIcon fontSize="small" />}
            value="john.doe@example.com"
            type="email"
            autoComplete="email"
            onChange={fn()}
          />
        </div>
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Autofilled Password (CSS simulation)
        </p>
        <div className="autofill-simulation">
          <Input
            title="Password"
            icon={<LockIcon fontSize="small" />}
            value="••••••••••"
            type="password"
            autoComplete="current-password"
            onChange={fn()}
          />
        </div>
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Regular input (not autofilled)
        </p>
        <Input
          title="Phone Number"
          type="tel"
          value="+1 (555) 123-4567"
          onChange={fn()}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how the Input component handles browser autofill styling. The first two inputs simulate the blue background that browsers apply to autofilled fields, while the floating labels remain visible with transparent backgrounds.',
      },
    },
  },
}

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '320px',
      }}
    >
      <Input
        height="small"
        title="Small Input"
        placeholder="Enter text"
        onChange={fn()}
      />
      <Input
        height="medium"
        title="Medium Input"
        placeholder="Enter text"
        onChange={fn()}
      />
      <Input
        height="large"
        title="Large Input"
        placeholder="Enter text"
        onChange={fn()}
      />
    </div>
  ),
}

export const InteractiveExample: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '320px',
      }}
    >
      <Input
        title="Full Name"
        icon={<PersonIcon fontSize="small" />}
        placeholder="John Doe"
        onChange={fn()}
        required
      />
      <Input
        title="Email Address"
        icon={<EmailIcon fontSize="small" />}
        type="email"
        placeholder="john@example.com"
        onChange={fn()}
        required
      />
      <Input
        title="Password"
        icon={<LockIcon fontSize="small" />}
        type="password"
        placeholder="Enter password"
        onChange={fn()}
        required
      />
      <Input
        title="Age"
        type="number"
        placeholder="18"
        onChange={fn()}
        min={1}
        max={120}
      />
    </div>
  ),
}

export const FormVariations: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '320px',
      }}
    >
      <Input
        title="Search"
        icon={<SearchIcon fontSize="small" />}
        type="search"
        placeholder="Search recipes..."
        onChange={fn()}
      />
      <Input
        title="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        onChange={fn()}
      />
      <Input
        title="Website URL"
        type="url"
        placeholder="https://example.com"
        onChange={fn()}
      />
      <Input
        title="Quantity"
        type="number"
        placeholder="0"
        min={0}
        max={100}
        step={5}
        onChange={fn()}
      />
    </div>
  ),
}

export const StateShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '320px',
      }}
    >
      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Empty State
        </p>
        <Input
          title="Empty Field"
          placeholder="Click to focus"
          onFocus={fn()}
          onBlur={fn()}
          onChange={fn()}
        />
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Filled State
        </p>
        <Input
          title="Filled Field"
          value="This field has content"
          placeholder="Placeholder"
          onChange={fn()}
        />
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Focus State
        </p>
        <Input
          title="Focus Me"
          placeholder="Click to see focus state"
          onFocus={fn()}
          onBlur={fn()}
          onChange={fn()}
        />
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Error State
        </p>
        <Input
          title="Error Field"
          value="Invalid input"
          error
          onChange={fn()}
        />
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Disabled State
        </p>
        <Input
          title="Disabled Field"
          value="Cannot edit"
          disabled
          onChange={fn()}
        />
      </div>
    </div>
  ),
}
