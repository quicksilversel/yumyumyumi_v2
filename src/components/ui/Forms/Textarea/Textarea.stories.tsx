import React from 'react'

import { fn } from 'storybook/test'

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
    onChange: {
      action: 'text-changed',
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

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    height: 'medium',
    onChange: fn(),
  },
}

export const WithTitle: Story = {
  args: {
    title: 'Message',
    placeholder: 'Type your message here...',
    onChange: fn(),
  },
}

export const WithValue: Story = {
  args: {
    title: 'Description',
    value: 'This is some pre-filled content in the textarea.',
    height: 'medium',
    onChange: fn(),
  },
}

export const Interactive: Story = {
  args: {
    title: 'Interactive Textarea',
    placeholder: 'Start typing...',
    height: 'medium',
    onChange: fn(),
    helperText: 'Use controls above to modify properties',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls panel to interact with this textarea. All change events will be logged in the Actions panel.',
      },
    },
  },
}

export const ResizeOptions: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        width: '800px',
      }}
    >
      <Textarea
        title="No Resize"
        placeholder="Cannot be resized"
        resize="none"
        onChange={fn()}
      />
      <Textarea
        title="Vertical Only"
        placeholder="Resize vertically only"
        resize="vertical"
        onChange={fn()}
      />
      <Textarea
        title="Horizontal Only"
        placeholder="Resize horizontally only"
        resize="horizontal"
        onChange={fn()}
      />
      <Textarea
        title="Both Directions"
        placeholder="Resize both ways"
        resize="both"
        onChange={fn()}
      />
    </div>
  ),
}

export const RowControls: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '500px',
      }}
    >
      <Textarea
        title="Minimum 5 Rows"
        placeholder="Always shows at least 5 rows"
        minRows={5}
        onChange={fn()}
      />
      <Textarea
        title="Maximum 4 Rows"
        placeholder="Scrolls after 4 rows"
        maxRows={4}
        value={`Row one
Row two  
Row three
Row four
Row five (will scroll)
Row six`}
        onChange={fn()}
      />
      <Textarea
        title="Min 3, Max 6 Rows"
        placeholder="Between 3-6 rows"
        minRows={3}
        maxRows={6}
        onChange={fn()}
      />
    </div>
  ),
}

export const SizeComparison: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '450px',
      }}
    >
      <Textarea
        height="small"
        title="Small Size"
        placeholder="Compact textarea"
        helperText="Small height variant"
        onChange={fn()}
      />
      <Textarea
        height="medium"
        title="Medium Size"
        placeholder="Standard textarea"
        helperText="Default medium height"
        onChange={fn()}
      />
      <Textarea
        height="large"
        title="Large Size"
        placeholder="Spacious textarea"
        helperText="Large height for more content"
        onChange={fn()}
      />
    </div>
  ),
}

export const FieldStates: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '450px',
      }}
    >
      <Textarea
        title="Default State"
        placeholder="Normal textarea"
        onChange={fn()}
      />
      <Textarea
        title="Disabled State"
        placeholder="Cannot be edited"
        disabled
        value="This content is read-only"
        onChange={fn()}
      />
      <Textarea
        title="Error State"
        placeholder="Has validation error"
        error
        helperText="Please correct this field"
        onChange={fn()}
      />
      <Textarea
        title="Required Field"
        placeholder="Must be filled"
        required
        helperText="This field is mandatory"
        onChange={fn()}
      />
    </div>
  ),
}

export const HelperTextVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '450px',
      }}
    >
      <Textarea
        title="With Info Helper"
        placeholder="Enter description..."
        helperText="Provide detailed information here"
        onChange={fn()}
      />
      <Textarea
        title="With Error Helper"
        placeholder="Enter comments..."
        error
        helperText="Minimum 10 characters required"
        onChange={fn()}
      />
      <Textarea
        title="With Character Limit"
        placeholder="Write summary..."
        helperText="Maximum 250 characters allowed"
        maxLength={250}
        onChange={fn()}
      />
    </div>
  ),
}

export const ContactFormExample: Story = {
  render: () => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '500px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
      onSubmit={(e) => {
        e.preventDefault()
        alert('Contact form submitted! Check Actions panel.')
      }}
    >
      <h3 style={{ margin: '0 0 16px 0' }}>Contact Us</h3>

      <Textarea
        title="Your Message"
        placeholder="How can we help you?"
        helperText="Please describe your inquiry in detail"
        minRows={4}
        required
        onChange={fn()}
      />

      <Textarea
        title="Additional Comments"
        placeholder="Any other information..."
        helperText="Optional: share any extra details"
        minRows={2}
        maxRows={5}
        onChange={fn()}
      />

      <button
        type="submit"
        style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Send Message
      </button>
    </form>
  ),
}

export const CharacterTrackingDemo: Story = {
  render: () => (
    <div style={{ width: '450px' }}>
      <Textarea
        title="Message with Character Count"
        placeholder="Type your message..."
        value="This is a sample message to demonstrate character counting functionality."
        onChange={fn()}
        maxLength={200}
        helperText="125 characters remaining (static demo)"
      />
      <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        Note: Use the Interactive story for real character counting behavior.
      </p>
    </div>
  ),
}

export const CodeSnippetInput: Story = {
  args: {
    title: 'Code Block',
    placeholder: 'Paste your code here...',
    value: `function greetUser(name) {
  const message = \`Hello, \${name}! Welcome back.\`;
  console.log(message);
  return message;
}

greetUser('Alice');`,
    minRows: 8,
    style: { fontFamily: 'monospace', fontSize: '14px' },
    onChange: fn(),
  },
}

export const ArticleContentExample: Story = {
  args: {
    title: 'Article Content',
    value: `Introduction paragraph that sets the context for the article content. This demonstrates how the textarea handles longer blocks of text.

Main content section with multiple paragraphs and detailed information. The textarea automatically adjusts its height based on the content length when configured properly.

Conclusion section that wraps up the article content. This example shows how the component handles substantial amounts of text while maintaining good usability.

Additional notes and references can be added here to complete the content example.`,
    minRows: 6,
    maxRows: 12,
    onChange: fn(),
  },
}
