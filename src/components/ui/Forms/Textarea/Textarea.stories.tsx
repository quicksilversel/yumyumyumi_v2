import CommentIcon from '@mui/icons-material/Comment'
import DescriptionIcon from '@mui/icons-material/Description'
import NotesIcon from '@mui/icons-material/Notes'
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
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Description',
    placeholder: 'Enter your description here...',
    height: 'medium',
    minRows: 3,
    onChange: fn(),
  },
}

export const WithFloatingLabel: Story = {
  args: {
    title: 'Comments',
    placeholder: 'Add your comments',
    height: 'medium',
    minRows: 4,
    onChange: fn(),
  },
}

export const WithValue: Story = {
  args: {
    title: 'Bio',
    value:
      'This is pre-filled content that shows the floating label in its raised position.',
    placeholder: 'Tell us about yourself',
    height: 'medium',
    onChange: fn(),
  },
}

export const WithIcon: Story = {
  args: {
    title: 'Notes',
    icon: <NotesIcon fontSize="small" />,
    placeholder: 'Add your notes here',
    height: 'medium',
    minRows: 3,
    onChange: fn(),
  },
}

export const WithHelperText: Story = {
  args: {
    title: 'Message',
    placeholder: 'Type your message',
    helperText: 'Maximum 500 characters allowed',
    maxLength: 500,
    height: 'medium',
    onChange: fn(),
  },
}

export const Required: Story = {
  args: {
    title: 'Required Field',
    placeholder: 'This field is required',
    required: true,
    helperText: 'This information is mandatory',
    height: 'medium',
    onChange: fn(),
  },
}

export const Error: Story = {
  args: {
    title: 'Description',
    value: 'Too short',
    error: true,
    helperText: 'Minimum 20 characters required',
    height: 'medium',
    onChange: fn(),
  },
}

export const Disabled: Story = {
  args: {
    title: 'Read Only',
    value: 'This content cannot be edited',
    disabled: true,
    height: 'medium',
    onChange: fn(),
  },
}

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '400px',
      }}
    >
      <Textarea
        height="small"
        title="Small Textarea"
        placeholder="Compact size"
        minRows={2}
        onChange={fn()}
      />
      <Textarea
        height="medium"
        title="Medium Textarea"
        placeholder="Standard size"
        minRows={3}
        onChange={fn()}
      />
      <Textarea
        height="large"
        title="Large Textarea"
        placeholder="Spacious size"
        minRows={4}
        onChange={fn()}
      />
    </div>
  ),
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
        placeholder="Fixed size"
        resize="none"
        minRows={3}
        onChange={fn()}
      />
      <Textarea
        title="Vertical Only"
        placeholder="Resize height only"
        resize="vertical"
        minRows={3}
        onChange={fn()}
      />
      <Textarea
        title="Horizontal Only"
        placeholder="Resize width only"
        resize="horizontal"
        minRows={3}
        onChange={fn()}
      />
      <Textarea
        title="Both Directions"
        placeholder="Resize freely"
        resize="both"
        minRows={3}
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
        width: '400px',
      }}
    >
      <Textarea
        title="Comment"
        icon={<CommentIcon fontSize="small" />}
        placeholder="Share your thoughts"
        onChange={fn()}
        helperText="Be constructive and respectful"
        minRows={3}
        required
      />
      <Textarea
        title="Product Description"
        icon={<DescriptionIcon fontSize="small" />}
        placeholder="Describe the product"
        onChange={fn()}
        helperText="Maximum 200 characters"
        maxLength={200}
        minRows={4}
        maxRows={6}
      />
      <Textarea
        title="Additional Notes"
        icon={<NotesIcon fontSize="small" />}
        placeholder="Any other information"
        onChange={fn()}
        minRows={2}
        resize="none"
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
        width: '450px',
        padding: '24px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
      }}
      onSubmit={(e) => {
        e.preventDefault()
        fn()()
      }}
    >
      <h3 style={{ margin: 0 }}>User Feedback Form</h3>

      <Textarea
        title="Overall Feedback"
        placeholder="How was your experience?"
        onChange={fn()}
        minRows={3}
        required
        helperText="Please provide detailed feedback"
      />

      <Textarea
        title="Describe Your Experience"
        placeholder="Tell us more about your journey"
        onChange={fn()}
        minRows={4}
        maxRows={8}
        helperText="Share specific examples if possible"
      />

      <Textarea
        title="Suggestions for Improvement"
        placeholder="How can we do better?"
        onChange={fn()}
        minRows={3}
        maxRows={6}
      />

      <button
        type="submit"
        style={{
          padding: '12px 24px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        Submit Feedback
      </button>
    </form>
  ),
}

export const StateShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '400px',
      }}
    >
      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Empty State
        </p>
        <Textarea
          title="Empty Field"
          placeholder="Click to focus"
          onFocus={fn()}
          onBlur={fn()}
          onChange={fn()}
          minRows={3}
        />
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Filled State
        </p>
        <Textarea
          title="Filled Field"
          value="This field has content and the label stays floating"
          placeholder="Placeholder"
          onChange={fn()}
          minRows={3}
        />
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Focus State
        </p>
        <Textarea
          title="Focus Me"
          placeholder="Click to see focus state"
          onFocus={fn()}
          onBlur={fn()}
          onChange={fn()}
          minRows={3}
        />
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Error State
        </p>
        <Textarea
          title="Error Field"
          value="Invalid"
          error
          helperText="This field has an error"
          onChange={fn()}
          minRows={3}
        />
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
          Disabled State
        </p>
        <Textarea
          title="Disabled Field"
          value="Cannot edit this content"
          disabled
          onChange={fn()}
          minRows={3}
        />
      </div>
    </div>
  ),
}

export const RecipeFormExample: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '500px',
      }}
    >
      <h3 style={{ margin: 0 }}>Recipe Details</h3>

      <Textarea
        title="Ingredients"
        placeholder="List all ingredients (one per line)"
        onChange={fn()}
        minRows={5}
        maxRows={10}
        helperText="Include quantities and measurements"
        required
      />

      <Textarea
        title="Cooking Instructions"
        placeholder="Step-by-step instructions"
        onChange={fn()}
        minRows={6}
        maxRows={12}
        helperText="Be clear and detailed"
        required
      />

      <Textarea
        title="Chef's Notes"
        placeholder="Tips, variations, or serving suggestions"
        onChange={fn()}
        minRows={3}
        maxRows={6}
        helperText="Optional: Share your expertise"
      />
    </div>
  ),
}
