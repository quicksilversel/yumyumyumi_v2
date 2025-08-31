import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'

import { Dialog } from './Dialog'

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
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Dialog
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Dialog Title"
        >
          <p>This is the dialog content. You can put any content here.</p>
        </Dialog>
      </>
    )
  },
}

// With Actions
export const WithActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog with Actions</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Action"
          actions={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p>Are you sure you want to proceed with this action?</p>
        </Dialog>
      </>
    )
  },
}

// Different Sizes
export const SmallDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Small Dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Small Dialog"
          maxWidth="sm"
        >
          <p>This is a small dialog with maxWidth set to 'sm'.</p>
        </Dialog>
      </>
    )
  },
}

export const LargeDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Large Dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Large Dialog"
          maxWidth="lg"
        >
          <p>This is a large dialog with maxWidth set to 'lg'.</p>
          <p>It can contain more content and is wider than the default dialog.</p>
        </Dialog>
      </>
    )
  },
}

// Without Title
export const NoTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog without Title</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <p>This dialog doesn't have a title, but still has a close functionality.</p>
        </Dialog>
      </>
    )
  },
}

// Long Content
export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog with Long Content</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Terms and Conditions"
          maxWidth="md"
          actions={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Decline
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Accept
              </Button>
            </>
          }
        >
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </Dialog>
      </>
    )
  },
}

// Form Example
export const FormDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Form Dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="User Information"
          maxWidth="md"
          actions={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </>
          }
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Message</label>
              <textarea
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  minHeight: '100px',
                }}
                placeholder="Enter your message"
              />
            </div>
          </form>
        </Dialog>
      </>
    )
  },
}

// All Sizes Demo
export const AllSizes: Story = {
  render: () => {
    const [openSm, setOpenSm] = useState(false)
    const [openMd, setOpenMd] = useState(false)
    const [openLg, setOpenLg] = useState(false)
    const [openXl, setOpenXl] = useState(false)

    return (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button onClick={() => setOpenSm(true)}>Small (sm)</Button>
        <Button onClick={() => setOpenMd(true)}>Medium (md)</Button>
        <Button onClick={() => setOpenLg(true)}>Large (lg)</Button>
        <Button onClick={() => setOpenXl(true)}>Extra Large (xl)</Button>

        <Dialog
          open={openSm}
          onClose={() => setOpenSm(false)}
          title="Small Dialog"
          maxWidth="sm"
        >
          <p>This is a small dialog (400px max width)</p>
        </Dialog>

        <Dialog
          open={openMd}
          onClose={() => setOpenMd(false)}
          title="Medium Dialog"
          maxWidth="md"
        >
          <p>This is a medium dialog (600px max width)</p>
        </Dialog>

        <Dialog
          open={openLg}
          onClose={() => setOpenLg(false)}
          title="Large Dialog"
          maxWidth="lg"
        >
          <p>This is a large dialog (800px max width)</p>
        </Dialog>

        <Dialog
          open={openXl}
          onClose={() => setOpenXl(false)}
          title="Extra Large Dialog"
          maxWidth="xl"
        >
          <p>This is an extra large dialog (1000px max width)</p>
        </Dialog>
      </div>
    )
  },
}