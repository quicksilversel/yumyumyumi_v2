import type { Meta, StoryObj } from '@storybook/react'

import { Container, Grid, Flex, Stack, Divider, Spacer } from './Layout'

const meta: Meta = {
  title: 'Components/Layout',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const ContainerDefault: Story = {
  render: () => (
    <Container>
      <div
        style={{ background: '#f0f0f0', padding: '20px', textAlign: 'center' }}
      >
        Default Container (max-width: xl)
      </div>
    </Container>
  ),
}

export const ContainerSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Container maxWidth="sm">
        <div
          style={{
            background: '#e0e0e0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          Small Container (sm)
        </div>
      </Container>
      <Container maxWidth="md">
        <div
          style={{
            background: '#d0d0d0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          Medium Container (md)
        </div>
      </Container>
      <Container maxWidth="lg">
        <div
          style={{
            background: '#c0c0c0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          Large Container (lg)
        </div>
      </Container>
      <Container maxWidth="xl">
        <div
          style={{
            background: '#b0b0b0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          Extra Large Container (xl)
        </div>
      </Container>
      <Container maxWidth="2xl">
        <div
          style={{
            background: '#a0a0a0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          2XL Container (2xl)
        </div>
      </Container>
    </div>
  ),
}

export const ContainerNoPadding: Story = {
  render: () => (
    <Container noPadding>
      <div
        style={{ background: '#f0f0f0', padding: '20px', textAlign: 'center' }}
      >
        Container with no padding
      </div>
    </Container>
  ),
}

export const GridDefault: Story = {
  render: () => (
    <Grid cols={3} gap={4}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          style={{
            background: '#e0e0e0',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
          }}
        >
          Item {item}
        </div>
      ))}
    </Grid>
  ),
}

export const GridResponsive: Story = {
  render: () => (
    <Grid cols={4} gap={4} responsive>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div
          key={item}
          style={{
            background: '#e0e0e0',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
          }}
        >
          Item {item}
        </div>
      ))}
    </Grid>
  ),
}

export const GridDifferentColumns: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Grid cols={2} gap={3}>
        <div
          style={{
            background: '#e0e0e0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          2 Columns
        </div>
        <div
          style={{
            background: '#e0e0e0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          2 Columns
        </div>
      </Grid>
      <Grid cols={3} gap={3}>
        <div
          style={{
            background: '#d0d0d0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          3 Columns
        </div>
        <div
          style={{
            background: '#d0d0d0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          3 Columns
        </div>
        <div
          style={{
            background: '#d0d0d0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          3 Columns
        </div>
      </Grid>
      <Grid cols={4} gap={3}>
        <div
          style={{
            background: '#c0c0c0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          4 Cols
        </div>
        <div
          style={{
            background: '#c0c0c0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          4 Cols
        </div>
        <div
          style={{
            background: '#c0c0c0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          4 Cols
        </div>
        <div
          style={{
            background: '#c0c0c0',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          4 Cols
        </div>
      </Grid>
    </div>
  ),
}

export const FlexDefault: Story = {
  render: () => (
    <Flex gap={4}>
      <div style={{ background: '#e0e0e0', padding: '20px' }}>Item 1</div>
      <div style={{ background: '#d0d0d0', padding: '20px' }}>Item 2</div>
      <div style={{ background: '#c0c0c0', padding: '20px' }}>Item 3</div>
    </Flex>
  ),
}

export const FlexDirection: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Flex direction="row" gap={3}>
        <div style={{ background: '#e0e0e0', padding: '20px' }}>Row 1</div>
        <div style={{ background: '#e0e0e0', padding: '20px' }}>Row 2</div>
        <div style={{ background: '#e0e0e0', padding: '20px' }}>Row 3</div>
      </Flex>
      <Flex direction="column" gap={3}>
        <div style={{ background: '#d0d0d0', padding: '20px' }}>Column 1</div>
        <div style={{ background: '#d0d0d0', padding: '20px' }}>Column 2</div>
        <div style={{ background: '#d0d0d0', padding: '20px' }}>Column 3</div>
      </Flex>
    </div>
  ),
}

export const FlexAlignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Flex
        align="start"
        justify="start"
        gap={3}
        style={{ height: '100px', background: '#f5f5f5' }}
      >
        <div style={{ background: '#e0e0e0', padding: '10px' }}>
          Start/Start
        </div>
      </Flex>
      <Flex
        align="center"
        justify="center"
        gap={3}
        style={{ height: '100px', background: '#f5f5f5' }}
      >
        <div style={{ background: '#d0d0d0', padding: '10px' }}>
          Center/Center
        </div>
      </Flex>
      <Flex
        align="end"
        justify="end"
        gap={3}
        style={{ height: '100px', background: '#f5f5f5' }}
      >
        <div style={{ background: '#c0c0c0', padding: '10px' }}>End/End</div>
      </Flex>
      <Flex
        align="center"
        justify="between"
        gap={3}
        style={{ height: '100px', background: '#f5f5f5' }}
      >
        <div style={{ background: '#b0b0b0', padding: '10px' }}>Between</div>
        <div style={{ background: '#b0b0b0', padding: '10px' }}>Between</div>
        <div style={{ background: '#b0b0b0', padding: '10px' }}>Between</div>
      </Flex>
    </div>
  ),
}

export const FlexWrap: Story = {
  render: () => (
    <Flex wrap gap={3} style={{ width: '400px' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div
          key={item}
          style={{
            background: '#e0e0e0',
            padding: '20px',
            minWidth: '100px',
            textAlign: 'center',
          }}
        >
          Item {item}
        </div>
      ))}
    </Flex>
  ),
}

export const StackDefault: Story = {
  render: () => (
    <Stack gap={4}>
      <div style={{ background: '#e0e0e0', padding: '20px' }}>Stack Item 1</div>
      <div style={{ background: '#d0d0d0', padding: '20px' }}>Stack Item 2</div>
      <div style={{ background: '#c0c0c0', padding: '20px' }}>Stack Item 3</div>
      <div style={{ background: '#b0b0b0', padding: '20px' }}>Stack Item 4</div>
    </Stack>
  ),
}

export const DividerHorizontal: Story = {
  render: () => (
    <div>
      <div style={{ padding: '20px' }}>Content above divider</div>
      <Divider />
      <div style={{ padding: '20px' }}>Content below divider</div>
    </div>
  ),
}

export const DividerVertical: Story = {
  render: () => (
    <Flex align="center" style={{ height: '100px' }}>
      <div style={{ padding: '20px' }}>Left content</div>
      <Divider vertical />
      <div style={{ padding: '20px' }}>Right content</div>
    </Flex>
  ),
}

export const DividerSpacing: Story = {
  render: () => (
    <div>
      <div style={{ padding: '20px' }}>Small spacing</div>
      <Divider spacing={2} />
      <div style={{ padding: '20px' }}>Medium spacing</div>
      <Divider spacing={4} />
      <div style={{ padding: '20px' }}>Large spacing</div>
      <Divider spacing={8} />
      <div style={{ padding: '20px' }}>End</div>
    </div>
  ),
}

export const SpacerFlex: Story = {
  render: () => (
    <Flex style={{ width: '100%', background: '#f5f5f5', padding: '10px' }}>
      <div style={{ background: '#e0e0e0', padding: '20px' }}>Left</div>
      <Spacer />
      <div style={{ background: '#d0d0d0', padding: '20px' }}>Right</div>
    </Flex>
  ),
}

export const SpacerFixed: Story = {
  render: () => (
    <Flex>
      <div style={{ background: '#e0e0e0', padding: '20px' }}>Item 1</div>
      <Spacer size={4} />
      <div style={{ background: '#d0d0d0', padding: '20px' }}>Item 2</div>
      <Spacer size={8} />
      <div style={{ background: '#c0c0c0', padding: '20px' }}>Item 3</div>
    </Flex>
  ),
}

export const ComplexLayout: Story = {
  render: () => (
    <Container maxWidth="lg">
      <Stack gap={6}>
        <div
          style={{
            background: '#f0f0f0',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          Header
        </div>
        <Divider />
        <Grid cols={3} gap={4} responsive>
          <div
            style={{
              background: '#e0e0e0',
              padding: '60px',
              textAlign: 'center',
            }}
          >
            Card 1
          </div>
          <div
            style={{
              background: '#e0e0e0',
              padding: '60px',
              textAlign: 'center',
            }}
          >
            Card 2
          </div>
          <div
            style={{
              background: '#e0e0e0',
              padding: '60px',
              textAlign: 'center',
            }}
          >
            Card 3
          </div>
        </Grid>
        <Divider />
        <Flex justify="between" align="center">
          <div style={{ background: '#d0d0d0', padding: '20px' }}>
            Footer Left
          </div>
          <Spacer />
          <Flex gap={3}>
            <div style={{ background: '#c0c0c0', padding: '20px' }}>Link 1</div>
            <div style={{ background: '#c0c0c0', padding: '20px' }}>Link 2</div>
            <div style={{ background: '#c0c0c0', padding: '20px' }}>Link 3</div>
          </Flex>
        </Flex>
      </Stack>
    </Container>
  ),
}
