import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'

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
      <Chip clickable>
        Tag 1
        <CloseIcon style={{ fontSize: '16px' }} />
      </Chip>
      <Chip clickable variant="outlined">
        Tag 2
        <CloseIcon style={{ fontSize: '16px' }} />
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
        <Chip variant="filled" selected>Filled Selected</Chip>
        <Chip variant="filled" clickable>Filled Clickable</Chip>
        <Chip variant="filled" clickable selected>Filled Clickable Selected</Chip>
      </ChipGroup>
      <ChipGroup>
        <Chip variant="outlined">Outlined</Chip>
        <Chip variant="outlined" selected>Outlined Selected</Chip>
        <Chip variant="outlined" clickable>Outlined Clickable</Chip>
        <Chip variant="outlined" clickable selected>Outlined Clickable Selected</Chip>
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
      <Chip size="sm" variant="outlined">Small Outlined</Chip>
      <Chip size="md" variant="outlined">Medium Outlined</Chip>
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
          <Chip clickable>Technology</Chip>
          <Chip clickable>Design</Chip>
          <Chip clickable selected>Development</Chip>
          <Chip clickable>Marketing</Chip>
          <Chip clickable>Business</Chip>
        </ChipGroup>
      </div>
      <div>
        <h4 style={{ marginBottom: '8px' }}>Tags</h4>
        <ChipGroup gap={3}>
          <Chip variant="outlined" size="sm">React</Chip>
          <Chip variant="outlined" size="sm">TypeScript</Chip>
          <Chip variant="outlined" size="sm">Next.js</Chip>
          <Chip variant="outlined" size="sm">Emotion</Chip>
          <Chip variant="outlined" size="sm">Storybook</Chip>
        </ChipGroup>
      </div>
    </div>
  ),
}

// Interactive Selection
export const InteractiveSelection: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState<string[]>(['Item 2'])
    
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']
    
    const handleClick = (item: string) => {
      setSelectedItems(prev =>
        prev.includes(item)
          ? prev.filter(i => i !== item)
          : [...prev, item]
      )
    }
    
    return (
      <div>
        <h4 style={{ marginBottom: '8px' }}>Click to select/deselect</h4>
        <ChipGroup>
          {items.map(item => (
            <Chip
              key={item}
              clickable
              selected={selectedItems.includes(item)}
              onClick={() => handleClick(item)}
            >
              {item}
            </Chip>
          ))}
        </ChipGroup>
      </div>
    )
  },
}

// Deletable Chips
export const DeletableChips: Story = {
  render: () => {
    const [chips, setChips] = useState(['Chip 1', 'Chip 2', 'Chip 3', 'Chip 4'])
    
    const handleDelete = (chipToDelete: string) => {
      setChips(chips => chips.filter(chip => chip !== chipToDelete))
    }
    
    return (
      <div>
        <h4 style={{ marginBottom: '8px' }}>Click X to delete</h4>
        <ChipGroup>
          {chips.map(chip => (
            <Chip key={chip} clickable>
              {chip}
              <CloseIcon 
                style={{ fontSize: '16px', marginLeft: '4px' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(chip)
                }}
              />
            </Chip>
          ))}
        </ChipGroup>
        {chips.length === 0 && (
          <p style={{ marginTop: '16px', color: '#666' }}>All chips deleted!</p>
        )}
      </div>
    )
  },
}

// Color Variations (Custom)
export const ColorVariations: Story = {
  render: () => (
    <ChipGroup>
      <Chip style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}>Info</Chip>
      <Chip style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>Success</Chip>
      <Chip style={{ backgroundColor: '#fff3e0', color: '#f57c00' }}>Warning</Chip>
      <Chip style={{ backgroundColor: '#ffebee', color: '#c62828' }}>Error</Chip>
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