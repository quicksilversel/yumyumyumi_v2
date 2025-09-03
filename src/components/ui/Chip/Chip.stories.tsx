import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import { fn } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react'

import { Chip, ChipGroup } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
    },
    clickable: {
      control: { type: 'boolean' },
    },
    selected: {
      control: { type: 'boolean' },
    },
    onClick: {
      action: 'clicked',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Chip Stories
export const Default: Story = {
  args: {
    children: 'Default Chip',
    variant: 'filled',
    size: 'md',
  },
}

export const Outlined: Story = {
  args: {
    children: 'Outlined Chip',
    variant: 'outlined',
    size: 'md',
  },
}

// Size Variants
export const Small: Story = {
  args: {
    children: 'Small Chip',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium Chip',
    size: 'md',
  },
}

// State Variants
export const Clickable: Story = {
  args: {
    children: 'Clickable Chip',
    clickable: true,
    onClick: fn(),
  },
}

export const Selected: Story = {
  args: {
    children: 'Selected Chip',
    selected: true,
  },
}

export const ClickableSelected: Story = {
  args: {
    children: 'Clickable & Selected',
    clickable: true,
    selected: true,
    onClick: fn(),
  },
}

// With Icons
export const WithIcon: Story = {
  render: () => (
    <ChipGroup>
      <Chip>
        <StarIcon style={{ fontSize: '16px' }} />
        With Icon
      </Chip>
      <Chip variant="outlined">
        <StarIcon style={{ fontSize: '16px' }} />
        Outlined with Icon
      </Chip>
    </ChipGroup>
  ),
}

export const WithCloseIcon: Story = {
  render: () => (
    <ChipGroup>
      <Chip clickable onClick={fn()}>
        Tag 1
        <CloseIcon style={{ fontSize: '16px' }} onClick={fn()} />
      </Chip>
      <Chip clickable variant="outlined" onClick={fn()}>
        Tag 2
        <CloseIcon style={{ fontSize: '16px' }} onClick={fn()} />
      </Chip>
    </ChipGroup>
  ),
}

// All Variants Demo
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ChipGroup>
        <Chip variant="filled">Filled</Chip>
        <Chip variant="filled" selected>
          Filled Selected
        </Chip>
        <Chip variant="filled" clickable onClick={fn()}>
          Filled Clickable
        </Chip>
        <Chip variant="filled" clickable selected onClick={fn()}>
          Filled Clickable Selected
        </Chip>
      </ChipGroup>
      <ChipGroup>
        <Chip variant="outlined">Outlined</Chip>
        <Chip variant="outlined" selected>
          Outlined Selected
        </Chip>
        <Chip variant="outlined" clickable onClick={fn()}>
          Outlined Clickable
        </Chip>
        <Chip variant="outlined" clickable selected onClick={fn()}>
          Outlined Clickable Selected
        </Chip>
      </ChipGroup>
    </div>
  ),
}

// All Sizes Demo
export const AllSizes: Story = {
  render: () => (
    <ChipGroup>
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="sm" variant="outlined">
        Small Outlined
      </Chip>
      <Chip size="md" variant="outlined">
        Medium Outlined
      </Chip>
    </ChipGroup>
  ),
}

// Chip Group Demo
export const ChipGroupDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Categories</h4>
        <ChipGroup gap={2}>
          <Chip clickable onClick={fn()}>
            Technology
          </Chip>
          <Chip clickable onClick={fn()}>
            Design
          </Chip>
          <Chip clickable selected onClick={fn()}>
            Development
          </Chip>
          <Chip clickable onClick={fn()}>
            Marketing
          </Chip>
          <Chip clickable onClick={fn()}>
            Business
          </Chip>
        </ChipGroup>
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Tags</h4>
        <ChipGroup gap={3}>
          <Chip variant="outlined" size="sm">
            React
          </Chip>
          <Chip variant="outlined" size="sm">
            TypeScript
          </Chip>
          <Chip variant="outlined" size="sm">
            Next.js
          </Chip>
          <Chip variant="outlined" size="sm">
            Emotion
          </Chip>
          <Chip variant="outlined" size="sm">
            Storybook
          </Chip>
        </ChipGroup>
      </div>
    </div>
  ),
}

// Interactive Selection - Static version showing different states
export const SelectionStates: Story = {
  render: () => (
    <div>
      <h4 style={{ marginBottom: '8px' }}>
        Selection States (Use controls to interact)
      </h4>
      <ChipGroup>
        <Chip clickable onClick={fn()}>
          Unselected
        </Chip>
        <Chip clickable selected onClick={fn()}>
          Selected
        </Chip>
        <Chip clickable onClick={fn()}>
          Unselected
        </Chip>
        <Chip clickable selected onClick={fn()}>
          Selected
        </Chip>
        <Chip clickable onClick={fn()}>
          Unselected
        </Chip>
      </ChipGroup>
      <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        Click chips to see actions logged. Use individual Chip stories with
        controls for interactive selection.
      </p>
    </div>
  ),
}

// Deletable Chips - Static version
export const DeletableChips: Story = {
  render: () => (
    <div>
      <h4 style={{ marginBottom: '8px' }}>Deletable Chips</h4>
      <ChipGroup>
        <Chip clickable onClick={fn()}>
          Chip 1
          <CloseIcon
            style={{ fontSize: '16px', marginLeft: '4px' }}
            onClick={fn()}
          />
        </Chip>
        <Chip clickable onClick={fn()}>
          Chip 2
          <CloseIcon
            style={{ fontSize: '16px', marginLeft: '4px' }}
            onClick={fn()}
          />
        </Chip>
        <Chip clickable onClick={fn()}>
          Chip 3
          <CloseIcon
            style={{ fontSize: '16px', marginLeft: '4px' }}
            onClick={fn()}
          />
        </Chip>
        <Chip clickable onClick={fn()}>
          Chip 4
          <CloseIcon
            style={{ fontSize: '16px', marginLeft: '4px' }}
            onClick={fn()}
          />
        </Chip>
      </ChipGroup>
      <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        Click X icons to see delete actions logged in the Actions panel.
      </p>
    </div>
  ),
}

// Interactive Example - Use Storybook's controls
export const Interactive: Story = {
  args: {
    children: 'Interactive Chip',
    clickable: true,
    selected: false,
    variant: 'filled',
    size: 'md',
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls panel above to interact with this chip. Click events will be logged in the Actions panel.',
      },
    },
  },
}

// Color Variations (Custom)
export const ColorVariations: Story = {
  render: () => (
    <ChipGroup>
      <Chip
        style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
        clickable
        onClick={fn()}
      >
        Info
      </Chip>
      <Chip
        style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
        clickable
        onClick={fn()}
      >
        Success
      </Chip>
      <Chip
        style={{ backgroundColor: '#fff3e0', color: '#f57c00' }}
        clickable
        onClick={fn()}
      >
        Warning
      </Chip>
      <Chip
        style={{ backgroundColor: '#ffebee', color: '#c62828' }}
        clickable
        onClick={fn()}
      >
        Error
      </Chip>
    </ChipGroup>
  ),
}

// Long Text
export const LongText: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <ChipGroup>
        <Chip>Short</Chip>
        <Chip>Medium Length Chip</Chip>
        <Chip>This is a very long chip text that might wrap</Chip>
        <Chip size="sm">Small with long text content</Chip>
      </ChipGroup>
    </div>
  ),
}

// Filter Example - Shows common use case
export const FilterExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Categories (Single Select)</h4>
        <ChipGroup>
          <Chip clickable onClick={fn()}>
            All
          </Chip>
          <Chip clickable selected onClick={fn()}>
            Featured
          </Chip>
          <Chip clickable onClick={fn()}>
            New
          </Chip>
          <Chip clickable onClick={fn()}>
            Popular
          </Chip>
          <Chip clickable onClick={fn()}>
            Sale
          </Chip>
        </ChipGroup>
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Tags (Multi Select)</h4>
        <ChipGroup>
          <Chip variant="outlined" clickable selected onClick={fn()}>
            JavaScript
          </Chip>
          <Chip variant="outlined" clickable onClick={fn()}>
            React
          </Chip>
          <Chip variant="outlined" clickable selected onClick={fn()}>
            TypeScript
          </Chip>
          <Chip variant="outlined" clickable onClick={fn()}>
            CSS
          </Chip>
          <Chip variant="outlined" clickable onClick={fn()}>
            HTML
          </Chip>
        </ChipGroup>
      </div>
    </div>
  ),
}

// Sizes Comparison
export const SizesComparison: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '60px', fontSize: '14px' }}>Small:</span>
        <Chip size="sm">Small</Chip>
        <Chip size="sm" variant="outlined">
          Small Outlined
        </Chip>
        <Chip size="sm" clickable onClick={fn()}>
          Small Clickable
        </Chip>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '60px', fontSize: '14px' }}>Medium:</span>
        <Chip size="md">Medium</Chip>
        <Chip size="md" variant="outlined">
          Medium Outlined
        </Chip>
        <Chip size="md" clickable onClick={fn()}>
          Medium Clickable
        </Chip>
      </div>
    </div>
  ),
}

// Form Tags Example
export const FormTags: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          alert('Form submitted! Check Actions panel for chip interactions.')
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            Skills (select all that apply):
          </label>
          <ChipGroup>
            <Chip clickable onClick={fn()}>
              JavaScript
            </Chip>
            <Chip clickable selected onClick={fn()}>
              React
            </Chip>
            <Chip clickable onClick={fn()}>
              Vue
            </Chip>
            <Chip clickable selected onClick={fn()}>
              TypeScript
            </Chip>
            <Chip clickable onClick={fn()}>
              Node.js
            </Chip>
            <Chip clickable onClick={fn()}>
              Python
            </Chip>
            <Chip clickable selected onClick={fn()}>
              CSS
            </Chip>
            <Chip clickable onClick={fn()}>
              HTML
            </Chip>
          </ChipGroup>
        </div>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
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
    </div>
  ),
}
