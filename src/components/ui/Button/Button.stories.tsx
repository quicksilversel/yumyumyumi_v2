import type { Meta, StoryObj } from '@storybook/react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'

import { Button, IconButton } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'text'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Button Stories
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'md',
  },
}

export const Text: Story = {
  args: {
    children: 'Text Button',
    variant: 'text',
    size: 'md',
  },
}

// Size Variants
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

// State Stories
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
}

// Button with Icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <AddIcon />
        Add Item
      </>
    ),
  },
}

export const IconOnly: Story = {
  render: () => (
    <IconButton size="md">
      <SearchIcon />
    </IconButton>
  ),
}

// All Variants Demo
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
}

// All Sizes Demo
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

// Icon Button Stories
export const IconButtonSmall: Story = {
  render: () => (
    <IconButton size="sm">
      <EditIcon />
    </IconButton>
  ),
}

export const IconButtonMedium: Story = {
  render: () => (
    <IconButton size="md">
      <EditIcon />
    </IconButton>
  ),
}

export const IconButtonLarge: Story = {
  render: () => (
    <IconButton size="lg">
      <EditIcon />
    </IconButton>
  ),
}

export const IconButtonVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <IconButton size="sm">
        <AddIcon />
      </IconButton>
      <IconButton size="md">
        <EditIcon />
      </IconButton>
      <IconButton size="lg">
        <DeleteIcon />
      </IconButton>
    </div>
  ),
}

// Interactive Examples
export const ButtonWithLongText: Story = {
  args: {
    children: 'This is a button with very long text content',
    variant: 'primary',
  },
}

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled>
        Primary Disabled
      </Button>
      <Button variant="secondary" disabled>
        Secondary Disabled
      </Button>
      <Button variant="ghost" disabled>
        Ghost Disabled
      </Button>
      <Button variant="text" disabled>
        Text Disabled
      </Button>
      <IconButton disabled>
        <EditIcon />
      </IconButton>
    </div>
  ),
}
