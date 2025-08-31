import { useState } from 'react'

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
    size: {
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
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Toggle Stories
export const Default: Story = {
  args: {
    label: 'Toggle me',
    size: 'medium',
  },
}

export const Checked: Story = {
  args: {
    label: 'Checked by default',
    checked: true,
  },
}

export const NoLabel: Story = {
  args: {
    size: 'medium',
  },
}

// Size Variants
export const Small: Story = {
  args: {
    label: 'Small toggle',
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    label: 'Medium toggle',
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    label: 'Large toggle',
    size: 'large',
  },
}

// Label Position
export const LabelLeft: Story = {
  args: {
    label: 'Label on the left',
    labelPosition: 'left',
  },
}

export const LabelRight: Story = {
  args: {
    label: 'Label on the right',
    labelPosition: 'right',
  },
}

// State Stories
export const Disabled: Story = {
  args: {
    label: 'Disabled toggle',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled and checked',
    disabled: true,
    checked: true,
  },
}

// With Helper Text
export const WithHelperText: Story = {
  args: {
    label: 'Enable notifications',
    helperText: 'You will receive email notifications',
  },
}

export const WithErrorHelperText: Story = {
  args: {
    label: 'Accept terms',
    helperText: 'You must accept the terms to continue',
    error: true,
  },
}

// All Sizes Demo
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ToggleSwitch size="small" label="Small toggle switch" />
      <ToggleSwitch size="medium" label="Medium toggle switch" />
      <ToggleSwitch size="large" label="Large toggle switch" />
    </div>
  ),
}

// State Variations
export const StateVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ToggleSwitch label="Normal state" />
      <ToggleSwitch label="Checked state" checked />
      <ToggleSwitch label="Disabled state" disabled />
      <ToggleSwitch label="Disabled checked" disabled checked />
    </div>
  ),
}

// Interactive Example
export const Interactive: Story = {
  render: () => {
    const [isChecked, setIsChecked] = useState(false)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <ToggleSwitch
          label={isChecked ? 'ON' : 'OFF'}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          helperText={`The switch is currently ${isChecked ? 'on' : 'off'}`}
        />
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Current value: {isChecked.toString()}
        </p>
      </div>
    )
  },
}

// Settings Form Example
export const SettingsForm: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false,
      newsletter: true,
    })

    const handleChange =
      (setting: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings((prev) => ({ ...prev, [setting]: e.target.checked }))
      }

    return (
      <div style={{ width: '400px' }}>
        <h3 style={{ marginBottom: '24px' }}>Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h4
              style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}
            >
              Preferences
            </h4>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <ToggleSwitch
                label="Enable notifications"
                checked={settings.notifications}
                onChange={handleChange('notifications')}
                helperText="Get notified about important updates"
              />
              <ToggleSwitch
                label="Dark mode"
                checked={settings.darkMode}
                onChange={handleChange('darkMode')}
                helperText="Use dark theme for the interface"
              />
              <ToggleSwitch
                label="Auto-save"
                checked={settings.autoSave}
                onChange={handleChange('autoSave')}
                helperText="Automatically save your work"
              />
            </div>
          </div>

          <div>
            <h4
              style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}
            >
              Privacy
            </h4>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <ToggleSwitch
                label="Share analytics"
                checked={settings.analytics}
                onChange={handleChange('analytics')}
                helperText="Help us improve by sharing usage data"
              />
              <ToggleSwitch
                label="Newsletter subscription"
                checked={settings.newsletter}
                onChange={handleChange('newsletter')}
                helperText="Receive weekly updates and tips"
              />
            </div>
          </div>
        </div>
      </div>
    )
  },
}

// Feature Toggles Example
export const FeatureToggles: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <h3 style={{ marginBottom: '24px' }}>Feature Flags</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <ToggleSwitch
          label="Beta features"
          helperText="Access experimental features before release"
          size="large"
        />
        <ToggleSwitch
          label="Advanced mode"
          helperText="Show advanced options and settings"
          size="large"
        />
        <ToggleSwitch
          label="Developer tools"
          helperText="Enable debugging and development features"
          size="large"
          disabled
        />
      </div>
    </div>
  ),
}

// Accessibility Example
export const AccessibilitySettings: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <h3 style={{ marginBottom: '24px' }}>Accessibility</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ToggleSwitch
          label="High contrast mode"
          labelPosition="left"
          helperText="Increase contrast for better visibility"
        />
        <ToggleSwitch
          label="Reduce motion"
          labelPosition="left"
          helperText="Minimize animations and transitions"
        />
        <ToggleSwitch
          label="Screen reader mode"
          labelPosition="left"
          helperText="Optimize for screen reader compatibility"
        />
        <ToggleSwitch
          label="Large text"
          labelPosition="left"
          helperText="Increase text size throughout the app"
        />
      </div>
    </div>
  ),
}

// Mixed Sizes and States
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
      <ToggleSwitch size="small" label="Small OFF" />
      <ToggleSwitch size="small" label="Small ON" checked />
      <ToggleSwitch size="small" label="Small Disabled" disabled />

      <ToggleSwitch size="medium" label="Medium OFF" />
      <ToggleSwitch size="medium" label="Medium ON" checked />
      <ToggleSwitch size="medium" label="Medium Disabled" disabled />

      <ToggleSwitch size="large" label="Large OFF" />
      <ToggleSwitch size="large" label="Large ON" checked />
      <ToggleSwitch size="large" label="Large Disabled" disabled />
    </div>
  ),
}

// Controlled Component Example
export const ControlledComponent: Story = {
  render: () => {
    const [isPublic, setIsPublic] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)

    return (
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '400px',
        }}
        onSubmit={(e) => {
          e.preventDefault()
          alert(`Public: ${isPublic}, Terms: ${acceptTerms}`)
        }}
      >
        <ToggleSwitch
          label="Make profile public"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          helperText="Your profile will be visible to everyone"
        />

        <ToggleSwitch
          label="I accept the terms and conditions"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          error={!acceptTerms}
          helperText={
            !acceptTerms
              ? 'You must accept the terms'
              : 'Thank you for accepting'
          }
        />

        <button
          type="submit"
          disabled={!acceptTerms}
          style={{
            padding: '10px 20px',
            backgroundColor: acceptTerms ? '#000' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: acceptTerms ? 'pointer' : 'not-allowed',
          }}
        >
          Submit
        </button>
      </form>
    )
  },
}
