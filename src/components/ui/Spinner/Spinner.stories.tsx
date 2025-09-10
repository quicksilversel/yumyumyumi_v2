import { Theme } from '@emotion/react'
import { useTheme } from '@emotion/react'

import type { Meta, StoryObj } from '@storybook/react'

import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: { type: 'color' },
    },
    thickness: {
      control: { type: 'number', min: 1, max: 10 },
    },
    speed: {
      control: { type: 'number', min: 0.5, max: 5, step: 0.5 },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Small: Story = {
  args: {
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
  },
}

export const CustomColor: Story = {
  args: {
    color: '#1976d2',
  },
}

export const CustomThickness: Story = {
  args: {
    thickness: 5,
  },
}

export const FastSpeed: Story = {
  args: {
    speed: 0.5,
  },
}

export const SlowSpeed: Story = {
  args: {
    speed: 2,
  },
}

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Spinner size="small" />
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          Small
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="medium" />
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          Medium
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="large" />
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          Large
        </p>
      </div>
    </div>
  ),
}

export const ColorVariations: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
      }}
    >
      <Spinner color="#1976d2" />
      <Spinner color="#2e7d32" />
      <Spinner color="#ed6c02" />
      <Spinner color="#d32f2f" />
      <Spinner color="#9c27b0" />
    </div>
  ),
}

export const SpeedVariations: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Spinner speed={0.5} />
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          0.5s
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner speed={1} />
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>1s</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner speed={2} />
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>2s</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner speed={3} />
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>3s</p>
      </div>
    </div>
  ),
}

export const WithTheme: Story = {
  render: () => {
    const ThemedSpinner = () => {
      const theme = useTheme() as Theme
      return (
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Spinner color={theme.colors.primary} />
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              Primary
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner color={theme.colors.success} />
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              Success
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner color={theme.colors.warning} />
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              Warning
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner color={theme.colors.error} />
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              Error
            </p>
          </div>
        </div>
      )
    }
    return <ThemedSpinner />
  },
}

export const LoadingCard: Story = {
  render: () => (
    <div
      style={{
        width: '300px',
        padding: '24px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Spinner size="large" color="#1976d2" />
        <p style={{ margin: 0, color: '#666' }}>Loading content...</p>
      </div>
    </div>
  ),
}

export const InlineLoading: Story = {
  render: () => (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        border: '1px solid #1976d2',
        borderRadius: '4px',
        backgroundColor: '#1976d2',
        color: '#fff',
        fontSize: '14px',
        cursor: 'not-allowed',
        opacity: 0.8,
      }}
      disabled
    >
      <Spinner size="small" color="#fff" thickness={2} />
      Saving...
    </button>
  ),
}

export const FullPageLoader: Story = {
  render: () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <Spinner size="large" color="#1976d2" />
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
          Loading Application
        </h3>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Please wait while we load your content
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
