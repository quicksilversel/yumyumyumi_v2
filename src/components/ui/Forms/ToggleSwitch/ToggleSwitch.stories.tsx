import { fn } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react'

import { ToggleSwitch } from './ToggleSwitch'

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Components/Forms/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
    },
    label: {
      control: { type: 'text' },
    },
    helperText: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    checked: {
      control: { type: 'boolean' },
    },
    onChange: {
      action: 'changed',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Toggle me',
    height: 'medium',
    onChange: fn(),
  },
}

export const Checked: Story = {
  args: {
    label: 'Checked by default',
    checked: true,
    onChange: fn(),
  },
}

export const NoLabel: Story = {
  args: {
    height: 'medium',
    onChange: fn(),
  },
}

export const Small: Story = {
  args: {
    label: 'Small toggle',
    height: 'small',
    onChange: fn(),
  },
}

export const Medium: Story = {
  args: {
    label: 'Medium toggle',
    height: 'medium',
    onChange: fn(),
  },
}

export const Large: Story = {
  args: {
    label: 'Large toggle',
    height: 'large',
    onChange: fn(),
  },
}

export const LabelLeft: Story = {
  args: {
    label: 'Label on the left',
    labelPosition: 'left',
    onChange: fn(),
  },
}

export const LabelRight: Story = {
  args: {
    label: 'Label on the right',
    labelPosition: 'right',
    onChange: fn(),
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled toggle',
    disabled: true,
    onChange: fn(),
  },
}

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled and checked',
    disabled: true,
    checked: true,
    onChange: fn(),
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Enable notifications',
    helperText: 'You will receive email notifications',
    onChange: fn(),
  },
}

export const WithErrorHelperText: Story = {
  args: {
    label: 'Accept terms',
    helperText: 'You must accept the terms to continue',
    error: true,
    onChange: fn(),
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ToggleSwitch
        height="small"
        label="Small toggle switch"
        onChange={fn()}
      />
      <ToggleSwitch
        height="medium"
        label="Medium toggle switch"
        onChange={fn()}
      />
      <ToggleSwitch
        height="large"
        label="Large toggle switch"
        onChange={fn()}
      />
    </div>
  ),
}

export const StateVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ToggleSwitch label="Normal state" onChange={fn()} />
      <ToggleSwitch label="Checked state" checked onChange={fn()} />
      <ToggleSwitch label="Disabled state" disabled onChange={fn()} />
      <ToggleSwitch label="Disabled checked" disabled checked onChange={fn()} />
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    label: 'Interactive toggle',
    checked: false,
    onChange: fn(),
    helperText: 'Use the controls panel to toggle the checked state',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls panel above to interact with this toggle switch. The onChange events will be logged in the Actions panel.',
      },
    },
  },
}

export const SettingsForm: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <h3 style={{ marginBottom: '24px' }}>Settings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h4 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
            Preferences
          </h4>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <ToggleSwitch
              label="Enable notifications"
              checked
              onChange={fn()}
              helperText="Get notified about important updates"
            />
            <ToggleSwitch
              label="Dark mode"
              onChange={fn()}
              helperText="Use dark theme for the interface"
            />
            <ToggleSwitch
              label="Auto-save"
              checked
              onChange={fn()}
              helperText="Automatically save your work"
            />
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
            Privacy
          </h4>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <ToggleSwitch
              label="Share analytics"
              onChange={fn()}
              helperText="Help us improve by sharing usage data"
            />
            <ToggleSwitch
              label="Newsletter subscription"
              checked
              onChange={fn()}
              helperText="Receive weekly updates and tips"
            />
          </div>
        </div>
      </div>
    </div>
  ),
}

export const FeatureToggles: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <h3 style={{ marginBottom: '24px' }}>Feature Flags</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <ToggleSwitch
          label="Beta features"
          helperText="Access experimental features before release"
          height="large"
          onChange={fn()}
        />
        <ToggleSwitch
          label="Advanced mode"
          helperText="Show advanced options and settings"
          height="large"
          onChange={fn()}
        />
        <ToggleSwitch
          label="Developer tools"
          helperText="Enable debugging and development features"
          height="large"
          disabled
          onChange={fn()}
        />
      </div>
    </div>
  ),
}

export const AccessibilitySettings: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <h3 style={{ marginBottom: '24px' }}>Accessibility</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ToggleSwitch
          label="High contrast mode"
          labelPosition="left"
          helperText="Increase contrast for better visibility"
          onChange={fn()}
        />
        <ToggleSwitch
          label="Reduce motion"
          labelPosition="left"
          helperText="Minimize animations and transitions"
          onChange={fn()}
        />
        <ToggleSwitch
          label="Screen reader mode"
          labelPosition="left"
          helperText="Optimize for screen reader compatibility"
          onChange={fn()}
        />
        <ToggleSwitch
          label="Large text"
          labelPosition="left"
          helperText="Increase text height throughout the app"
          onChange={fn()}
        />
      </div>
    </div>
  ),
}

export const MixedDemo: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        maxWidth: '600px',
      }}
    >
      <ToggleSwitch height="small" label="Small OFF" onChange={fn()} />
      <ToggleSwitch height="small" label="Small ON" checked onChange={fn()} />
      <ToggleSwitch
        height="small"
        label="Small Disabled"
        disabled
        onChange={fn()}
      />

      <ToggleSwitch height="medium" label="Medium OFF" onChange={fn()} />
      <ToggleSwitch height="medium" label="Medium ON" checked onChange={fn()} />
      <ToggleSwitch
        height="medium"
        label="Medium Disabled"
        disabled
        onChange={fn()}
      />

      <ToggleSwitch height="large" label="Large OFF" onChange={fn()} />
      <ToggleSwitch height="large" label="Large ON" checked onChange={fn()} />
      <ToggleSwitch
        height="large"
        label="Large Disabled"
        disabled
        onChange={fn()}
      />
    </div>
  ),
}

export const FormExample: Story = {
  render: () => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '400px',
      }}
      onSubmit={(e) => {
        e.preventDefault()
        alert(
          'Form submitted! Check the Actions panel for toggle interactions.',
        )
      }}
    >
      <ToggleSwitch
        label="Make profile public"
        onChange={fn()}
        helperText="Your profile will be visible to everyone"
      />

      <ToggleSwitch
        label="I accept the terms and conditions"
        onChange={fn()}
        helperText="Required to proceed"
        error
      />

      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </form>
  ),
}
