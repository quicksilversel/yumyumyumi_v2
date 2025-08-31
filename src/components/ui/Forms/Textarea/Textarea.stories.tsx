import type { Meta, StoryObj } from '@storybook/react'

import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Forms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    resize: {
      control: { type: 'select' },
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    title: {
      control: { type: 'text' },
    },
    placeholder: {
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
    required: {
      control: { type: 'boolean' },
    },
    minRows: {
      control: { type: 'number' },
    },
    maxRows: {
      control: { type: 'number' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Textarea Stories
export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    height: 'medium',
  },
}

export const WithTitle: Story = {
  args: {
    title: 'Message',
    placeholder: 'Type your message here...',
  },
}

export const WithValue: Story = {
  args: {
    title: 'Description',
    value: 'This is some pre-filled content in the textarea.',
    height: 'medium',
  },
}

// Size Variants
export const Small: Story = {
  args: {
    title: 'Small Textarea',
    placeholder: 'Small size textarea...',
    height: 'small',
  },
}

export const Medium: Story = {
  args: {
    title: 'Medium Textarea',
    placeholder: 'Medium size textarea...',
    height: 'medium',
  },
}

export const Large: Story = {
  args: {
    title: 'Large Textarea',
    placeholder: 'Large size textarea...',
    height: 'large',
  },
}

// State Stories
export const Disabled: Story = {
  args: {
    title: 'Disabled Field',
    placeholder: 'This field is disabled',
    value: 'You cannot edit this content',
    disabled: true,
  },
}

export const Error: Story = {
  args: {
    title: 'Error Field',
    placeholder: 'Enter valid content...',
    error: true,
    helperText: 'This field has an error',
  },
}

export const Required: Story = {
  args: {
    title: 'Required Field',
    placeholder: 'This field is required',
    required: true,
    helperText: 'This field must be filled out',
  },
}

// Helper Text
export const WithHelperText: Story = {
  args: {
    title: 'Bio',
    placeholder: 'Tell us about yourself...',
    helperText: 'Maximum 500 characters',
  },
}

export const WithErrorHelperText: Story = {
  args: {
    title: 'Comments',
    placeholder: 'Enter your comments...',
    error: true,
    helperText: 'Please enter at least 10 characters',
  },
}

// Resize Options
export const ResizeNone: Story = {
  args: {
    title: 'No Resize',
    placeholder: 'This textarea cannot be resized',
    resize: 'none',
  },
}

export const ResizeVertical: Story = {
  args: {
    title: 'Vertical Resize Only',
    placeholder: 'Can only resize vertically (default)',
    resize: 'vertical',
  },
}

export const ResizeHorizontal: Story = {
  args: {
    title: 'Horizontal Resize Only',
    placeholder: 'Can only resize horizontally',
    resize: 'horizontal',
  },
}

export const ResizeBoth: Story = {
  args: {
    title: 'Resize Both',
    placeholder: 'Can resize in both directions',
    resize: 'both',
  },
}

// Row Constraints
export const MinRows: Story = {
  args: {
    title: 'Minimum 5 Rows',
    placeholder: 'This textarea has a minimum of 5 rows',
    minRows: 5,
  },
}

export const MaxRows: Story = {
  args: {
    title: 'Maximum 5 Rows',
    placeholder: 'This textarea has a maximum of 5 rows (will scroll after that)',
    maxRows: 5,
    value: `Line 1
Line 2
Line 3
Line 4
Line 5
Line 6 - This will cause scrolling
Line 7
Line 8`,
  },
}

export const MinMaxRows: Story = {
  args: {
    title: 'Min 3, Max 8 Rows',
    placeholder: 'Between 3 and 8 rows',
    minRows: 3,
    maxRows: 8,
  },
}

// All Sizes Demo
export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '400px',
      }}
    >
      <Textarea
        height="small"
        title="Small"
        placeholder="Small textarea"
        helperText="Small size with helper text"
      />
      <Textarea
        height="medium"
        title="Medium"
        placeholder="Medium textarea"
        helperText="Medium size with helper text"
      />
      <Textarea
        height="large"
        title="Large"
        placeholder="Large textarea"
        helperText="Large size with helper text"
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
        gap: '20px',
        width: '400px',
      }}
    >
      <Textarea title="Normal" placeholder="Normal textarea" />
      <Textarea
        title="Disabled"
        placeholder="Disabled textarea"
        disabled
        value="This is disabled"
      />
      <Textarea
        title="Error"
        placeholder="Error textarea"
        error
        helperText="This field has an error"
      />
      <Textarea
        title="Required"
        placeholder="Required textarea"
        required
        helperText="This field is required"
      />
    </div>
  ),
}

// Form Example
export const FormExample: Story = {
  render: () => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '500px',
      }}
    >
      <Textarea
        id="bio"
        title="Bio"
        placeholder="Tell us about yourself..."
        helperText="Write a brief description about yourself (max 500 characters)"
        minRows={4}
        required
      />
      <Textarea
        id="experience"
        title="Experience"
        placeholder="Describe your relevant experience..."
        helperText="List your work experience and achievements"
        minRows={5}
        maxRows={10}
      />
      <Textarea
        id="notes"
        title="Additional Notes"
        placeholder="Any additional information..."
        helperText="Optional field for any other details"
        minRows={3}
      />
    </form>
  ),
}

// Character Counter Example
export const WithCharacterCounter: Story = {
  render: () => {
    const maxLength = 200
    const [value, setValue] = React.useState('')
    const remaining = maxLength - value.length

    return (
      <Textarea
        title="Limited Input"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        helperText={`${remaining} characters remaining`}
        error={remaining < 0}
      />
    )
  },
}

// Long Content Example
export const LongContent: Story = {
  args: {
    title: 'Article Content',
    value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
    minRows: 5,
    maxRows: 10,
  },
}

// Code Input Example
export const CodeInput: Story = {
  args: {
    title: 'Code Snippet',
    placeholder: 'Paste your code here...',
    value: `function calculateSum(a, b) {
  // Add two numbers together
  const result = a + b;
  console.log(\`The sum of \${a} and \${b} is \${result}\`);
  return result;
}

// Example usage
const sum = calculateSum(5, 10);`,
    minRows: 8,
    style: { fontFamily: 'monospace' },
  },
}

// import React for the interactive example
import React from 'react'