import { fn } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react'

import { Dialog } from './Dialog'

import { Button } from '../Button'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
    },
    title: {
      control: { type: 'text' },
    },
    maxWidth: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    onClose: {
      action: 'closed',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    title: 'Dialog Title',
    onClose: fn(),
    children: <p>This is the dialog content. You can put any content here.</p>,
  },
}

export const WithActions: Story = {
  args: {
    open: true,
    title: 'Confirm Action',
    onClose: fn(),
    actions: (
      <>
        <Button variant="secondary" onClick={fn()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={fn()}>
          Confirm
        </Button>
      </>
    ),
    children: <p>Are you sure you want to proceed with this action?</p>,
  },
}

export const SmallDialog: Story = {
  args: {
    open: true,
    title: 'Small Dialog',
    maxWidth: 'sm',
    onClose: fn(),
    children: <p>This is a small dialog with maxWidth set to sm.</p>,
  },
}

export const MediumDialog: Story = {
  args: {
    open: true,
    title: 'Medium Dialog',
    maxWidth: 'md',
    onClose: fn(),
    children: <p>This is a medium dialog with maxWidth set to md.</p>,
  },
}

export const LargeDialog: Story = {
  args: {
    open: true,
    title: 'Large Dialog',
    maxWidth: 'lg',
    onClose: fn(),
    children: (
      <>
        <p>This is a large dialog with maxWidth set to lg.</p>
        <p>It can contain more content and is wider than the default dialog.</p>
      </>
    ),
  },
}

export const ExtraLargeDialog: Story = {
  args: {
    open: true,
    title: 'Extra Large Dialog',
    maxWidth: 'xl',
    onClose: fn(),
    children: (
      <>
        <p>This is an extra large dialog with maxWidth set to xl.</p>
        <p>It provides the most space for complex content and forms.</p>
      </>
    ),
  },
}

export const NoTitle: Story = {
  args: {
    open: true,
    onClose: fn(),
    children: (
      <p>
        This dialog doesn&apos;t have a title, but still has a close
        functionality.
      </p>
    ),
  },
}

export const LongContent: Story = {
  args: {
    open: true,
    title: 'Terms and Conditions',
    maxWidth: 'md',
    onClose: fn(),
    actions: (
      <>
        <Button variant="secondary" onClick={fn()}>
          Decline
        </Button>
        <Button variant="primary" onClick={fn()}>
          Accept
        </Button>
      </>
    ),
    children: (
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        ))}
      </div>
    ),
  },
}

export const FormDialog: Story = {
  args: {
    open: true,
    title: 'User Information',
    maxWidth: 'md',
    onClose: fn(),
    actions: (
      <>
        <Button variant="secondary" onClick={fn()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={fn()}>
          Save
        </Button>
      </>
    ),
    children: (
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        onSubmit={(e) => {
          e.preventDefault()
          fn()()
        }}
      >
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Name</label>
          <input
            type="text"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            placeholder="Enter your name"
            onChange={fn()}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
          <input
            type="email"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            placeholder="Enter your email"
            onChange={fn()}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Message
          </label>
          <textarea
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '100px',
            }}
            placeholder="Enter your message"
            onChange={fn()}
          />
        </div>
      </form>
    ),
  },
}

export const Closed: Story = {
  args: {
    open: false,
    title: 'This Dialog is Closed',
    onClose: fn(),
    children: (
      <p>You won&apos;t see this content because the dialog is closed.</p>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'This shows the dialog in a closed state. Set open to true in the controls to see it.',
      },
    },
  },
}

export const Interactive: Story = {
  args: {
    open: true,
    title: 'Interactive Dialog',
    maxWidth: 'md',
    onClose: fn(),
    actions: (
      <>
        <Button variant="secondary" onClick={fn()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={fn()}>
          OK
        </Button>
      </>
    ),
    children: (
      <div>
        <p>Use the controls panel above to interact with this dialog:</p>
        <ul>
          <li>Toggle the &quot;open&quot; control to show/hide the dialog</li>
          <li>Change the &quot;title&quot; to see different titles</li>
          <li>Try different &quot;maxWidth&quot; values (sm, md, lg, xl)</li>
          <li>Click buttons to see actions logged in the Actions panel</li>
        </ul>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls panel above to interact with this dialog. All interactions will be logged in the Actions panel.',
      },
    },
  },
}

export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <h3>Dialog Size Comparison</h3>
        <p>All dialogs are shown in open state for comparison</p>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
        <Dialog open={true} title="Small (400px)" maxWidth="sm" onClose={fn()}>
          <p>Small dialog content area</p>
        </Dialog>

        <Dialog open={true} title="Medium (600px)" maxWidth="md" onClose={fn()}>
          <p>Medium dialog content area with more space</p>
        </Dialog>

        <Dialog open={true} title="Large (800px)" maxWidth="lg" onClose={fn()}>
          <p>
            Large dialog content area with even more space for complex content
          </p>
        </Dialog>

        <Dialog
          open={true}
          title="Extra Large (1000px)"
          maxWidth="xl"
          onClose={fn()}
        >
          <p>
            Extra large dialog content area with maximum space for very complex
            layouts and forms
          </p>
        </Dialog>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

export const ActionTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Dialog
        open={true}
        title="Confirmation Dialog"
        maxWidth="sm"
        onClose={fn()}
        actions={
          <>
            <Button variant="secondary" onClick={fn()}>
              Cancel
            </Button>
            <Button variant="primary" onClick={fn()}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this item?</p>
      </Dialog>

      <Dialog
        open={true}
        title="Multi-Action Dialog"
        maxWidth="md"
        onClose={fn()}
        actions={
          <>
            <Button variant="ghost" onClick={fn()}>
              Help
            </Button>
            <div style={{ flex: 1 }} />
            <Button variant="secondary" onClick={fn()}>
              Cancel
            </Button>
            <Button variant="primary" onClick={fn()}>
              Save
            </Button>
            <Button variant="primary" onClick={fn()}>
              Save & Continue
            </Button>
          </>
        }
      >
        <p>
          Dialog with multiple action buttons showing different arrangements.
        </p>
      </Dialog>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

export const ConfirmationDialog: Story = {
  args: {
    open: true,
    title: 'Delete Item',
    maxWidth: 'sm',
    onClose: fn(),
    actions: (
      <>
        <Button variant="secondary" onClick={fn()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={fn()}>
          Delete
        </Button>
      </>
    ),
    children: (
      <div>
        <p>Are you sure you want to delete this item?</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          This action cannot be undone.
        </p>
      </div>
    ),
  },
}

export const SuccessDialog: Story = {
  args: {
    open: true,
    title: 'Success!',
    maxWidth: 'sm',
    onClose: fn(),
    actions: (
      <Button variant="primary" onClick={fn()}>
        Continue
      </Button>
    ),
    children: (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <p>Your changes have been saved successfully.</p>
      </div>
    ),
  },
}

export const ErrorDialog: Story = {
  args: {
    open: true,
    title: 'Error',
    maxWidth: 'sm',
    onClose: fn(),
    actions: (
      <>
        <Button variant="secondary" onClick={fn()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={fn()}>
          Try Again
        </Button>
      </>
    ),
    children: (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <p>Something went wrong. Please try again.</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Error code: 500 - Internal Server Error
        </p>
      </div>
    ),
  },
}
