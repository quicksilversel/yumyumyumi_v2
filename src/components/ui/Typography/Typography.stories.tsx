import type { Meta, StoryObj } from '@storybook/react'

import { H1, H2, H3, H4, H5, H6, Body, Caption, Label } from './Typography'

const meta: Meta = {
  title: 'Components/Typography',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Headings
export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <H1>Heading 1 - The quick brown fox</H1>
      <H2>Heading 2 - The quick brown fox</H2>
      <H3>Heading 3 - The quick brown fox</H3>
      <H4>Heading 4 - The quick brown fox</H4>
      <H5>Heading 5 - The quick brown fox</H5>
      <H6>Heading 6 - The quick brown fox</H6>
    </div>
  ),
}

// Body Text
export const BodyText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Body size="lg">
        Large body text - Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Body>
      <Body>
        Base body text (default) - Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </Body>
      <Body size="sm">
        Small body text - Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Body>
    </div>
  ),
}

// Muted Text
export const MutedText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Body>Normal text color for comparison</Body>
      <Body muted>
        This is muted text - useful for secondary information or descriptions
      </Body>
      <Body size="sm" muted>
        Small muted text - perfect for footnotes or additional context
      </Body>
    </div>
  ),
}

// Caption and Label
export const CaptionAndLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Label>Label Text</Label>
        <Body style={{ marginTop: '8px' }}>
          Labels are typically used for form fields or section headers
        </Body>
      </div>
      <div>
        <Body>Regular content goes here</Body>
        <Caption style={{ display: 'block', marginTop: '4px' }}>
          Caption text - great for image captions or helper text
        </Caption>
      </div>
    </div>
  ),
}

// Complete Typography Scale
export const CompleteScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section>
        <H2 style={{ marginBottom: '16px' }}>Typography Scale</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <H1>H1 - Page Title</H1>
          <H2>H2 - Section Header</H2>
          <H3>H3 - Subsection</H3>
          <H4>H4 - Card Title</H4>
          <H5>H5 - List Header</H5>
          <H6>H6 - Overline</H6>
          <Body size="lg">Body Large - Lead paragraph</Body>
          <Body>Body Base - Regular content</Body>
          <Body size="sm">Body Small - Secondary text</Body>
          <Label>Label - Form labels</Label>
          <Caption>Caption - Helper text</Caption>
        </div>
      </section>
    </div>
  ),
}

// Real-world Example
export const ArticleExample: Story = {
  render: () => (
    <article style={{ maxWidth: '600px' }}>
      <H1>Building Better User Interfaces</H1>
      <Body muted style={{ marginTop: '8px', marginBottom: '24px' }}>
        Published on December 1, 2023 • 5 min read
      </Body>

      <Body size="lg" style={{ marginBottom: '24px' }}>
        Creating consistent and accessible typography is crucial for any design
        system. It helps establish visual hierarchy and improves readability
        across your application.
      </Body>

      <H2 style={{ marginTop: '32px', marginBottom: '16px' }}>
        Why Typography Matters
      </H2>
      <Body style={{ marginBottom: '16px' }}>
        Good typography enhances the user experience by making content easy to
        scan and read. It guides users through your interface and helps them
        understand the importance and relationship of different pieces of
        information.
      </Body>

      <H3 style={{ marginTop: '24px', marginBottom: '12px' }}>
        Key Principles
      </H3>
      <Body style={{ marginBottom: '12px' }}>
        There are several key principles to consider when designing a typography
        system:
      </Body>

      <ul style={{ marginBottom: '16px' }}>
        <li>
          <Body>Consistency in sizes and weights</Body>
        </li>
        <li>
          <Body>Clear hierarchy through scale</Body>
        </li>
        <li>
          <Body>Appropriate line heights for readability</Body>
        </li>
        <li>
          <Body>Sufficient contrast for accessibility</Body>
        </li>
      </ul>

      <Caption style={{ display: 'block', marginTop: '24px' }}>
        Note: This is an example of how different typography components work
        together in a real article.
      </Caption>
    </article>
  ),
}

// Form Example
export const FormExample: Story = {
  render: () => (
    <form
      style={{
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div>
        <Label style={{ display: 'block', marginBottom: '8px' }}>
          Full Name
        </Label>
        <input
          type="text"
          placeholder="Enter your name"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
        <Caption style={{ display: 'block', marginTop: '4px' }}>
          Enter your first and last name
        </Caption>
      </div>

      <div>
        <Label style={{ display: 'block', marginBottom: '8px' }}>
          Email Address
        </Label>
        <input
          type="email"
          placeholder="email@example.com"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
        <Caption style={{ display: 'block', marginTop: '4px' }}>
          We&apos;ll never share your email
        </Caption>
      </div>

      <div>
        <Label style={{ display: 'block', marginBottom: '8px' }}>Message</Label>
        <textarea
          placeholder="Type your message here..."
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            minHeight: '100px',
          }}
        />
        <Caption style={{ display: 'block', marginTop: '4px' }}>
          Maximum 500 characters
        </Caption>
      </div>
    </form>
  ),
}

// Card Example
export const CardExample: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '800px',
      }}
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            padding: '24px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}
        >
          <H6 style={{ marginBottom: '8px' }}>Featured</H6>
          <H4 style={{ marginBottom: '12px' }}>Card Title {i}</H4>
          <Body size="sm" muted style={{ marginBottom: '16px' }}>
            This is a description of the card content. It provides additional
            context and information.
          </Body>
          <Caption>Updated 2 hours ago</Caption>
        </div>
      ))}
    </div>
  ),
}

// Comparison
export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <H6 style={{ marginBottom: '12px' }}>Heading Sizes</H6>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <H1>H1</H1>
          <H2>H2</H2>
          <H3>H3</H3>
          <H4>H4</H4>
          <H5>H5</H5>
          <H6>H6</H6>
        </div>
      </div>

      <div>
        <H6 style={{ marginBottom: '12px' }}>Body Sizes</H6>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <Body size="lg">Large</Body>
          <Body>Base</Body>
          <Body size="sm">Small</Body>
          <Caption>Caption</Caption>
        </div>
      </div>

      <div>
        <H6 style={{ marginBottom: '12px' }}>Font Weights</H6>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <H1>Bold (H1, H2)</H1>
          <H4>Medium (H4, H5, Label)</H4>
          <H6>Semibold (H6)</H6>
          <Body>Normal (Body, Caption)</Body>
        </div>
      </div>
    </div>
  ),
}
