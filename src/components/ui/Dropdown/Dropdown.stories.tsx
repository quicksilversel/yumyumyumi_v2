import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SortIcon from '@mui/icons-material/Sort'
import TimerIcon from '@mui/icons-material/Timer'
import { fn } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react'

import { Dropdown, type DropdownOption } from './Dropdown'

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
    title: {
      control: 'text',
      description: 'Fixed title to display instead of selected value',
    },
    showCheckmark: {
      control: 'boolean',
      description: 'Show checkmark for selected option',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make dropdown take full width of container',
    },
    absoluteDropdown: {
      control: 'boolean',
      description: 'Use absolute positioning for dropdown (default: true)',
    },
    selectedValue: {
      control: false,
      description: 'Currently selected value',
    },
    onSelect: {
      action: 'selected',
      description: 'Callback when option is selected',
    },
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

const defaultOptions: DropdownOption<string>[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
]

export const Default: Story = {
  args: {
    options: defaultOptions,
    selectedValue: 'option1',
    onSelect: fn(),
    placeholder: 'Select an option',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const CookingTimeFilter: Story = {
  args: {
    options: [
      { label: 'すべて', value: null },
      { label: '15分以内', value: 15 },
      { label: '30分以内', value: 30 },
      { label: '45分以内', value: 45 },
      { label: '1時間以内', value: 60 },
    ],
    selectedValue: null,
    onSelect: fn(),
    placeholder: '調理時間から探す',
    icon: <TimerIcon />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const TagFilter: Story = {
  args: {
    options: [
      { label: 'すべて', value: null },
      { label: 'イタリアン', value: 'italian' },
      { label: '和食', value: 'japanese' },
      { label: '中華', value: 'chinese' },
      { label: 'デザート', value: 'dessert' },
      { label: 'ヘルシー', value: 'healthy' },
    ],
    selectedValue: null,
    onSelect: fn(),
    placeholder: 'タグから探す',
    icon: <LocalOfferIcon />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const SortDropdown: Story = {
  args: {
    options: [
      { label: '新しい順', value: 'date-desc' },
      { label: '古い順', value: 'date-asc' },
      { label: '名前順', value: 'alphabetical' },
      { label: '調理時間が短い順', value: 'cooktime-asc' },
      { label: '調理時間が長い順', value: 'cooktime-desc' },
    ],
    selectedValue: 'date-desc',
    onSelect: fn(),
    icon: <SortIcon />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const WithOptionIcons: Story = {
  args: {
    options: [
      { label: 'イタリアン', value: 'italian', icon: <RestaurantIcon /> },
      { label: '和食', value: 'japanese', icon: <RestaurantIcon /> },
      { label: '中華', value: 'chinese', icon: <RestaurantIcon /> },
      { label: 'フレンチ', value: 'french', icon: <RestaurantIcon /> },
    ],
    selectedValue: 'italian',
    onSelect: fn(),
    placeholder: '料理を選択',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const WithoutCheckmark: Story = {
  args: {
    options: defaultOptions,
    selectedValue: 'option1',
    onSelect: fn(),
    placeholder: 'Select an option',
    showCheckmark: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const FullWidth: Story = {
  args: {
    options: defaultOptions,
    selectedValue: 'option1',
    onSelect: fn(),
    placeholder: 'Select an option',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export const LongList: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: `option${i + 1}`,
    })),
    selectedValue: 'option1',
    onSelect: fn(),
    placeholder: 'Select from many options',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const MultipleDropdowns: Story = {
  render: () => {
    const sortOptions: DropdownOption<string>[] = [
      { label: '新しい順', value: 'date-desc' },
      { label: '古い順', value: 'date-asc' },
      { label: '名前順', value: 'alphabetical' },
    ]

    const timeOptions: DropdownOption<number | null>[] = [
      { label: 'すべて', value: null },
      { label: '15分以内', value: 15 },
      { label: '30分以内', value: 30 },
    ]

    const tagOptions: DropdownOption<string | null>[] = [
      { label: 'すべて', value: null },
      { label: 'イタリアン', value: 'italian' },
      { label: '和食', value: 'japanese' },
    ]

    return (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Dropdown
          options={sortOptions}
          selectedValue="date-desc"
          onSelect={fn()}
          icon={<SortIcon />}
        />
        <Dropdown
          options={timeOptions}
          selectedValue={null}
          onSelect={fn()}
          placeholder="調理時間"
          icon={<TimerIcon />}
        />
        <Dropdown
          options={tagOptions}
          selectedValue={null}
          onSelect={fn()}
          placeholder="タグ"
          icon={<LocalOfferIcon />}
        />
      </div>
    )
  },
}

export const Interactive: Story = {
  args: {
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' },
      { label: 'Date', value: 'date' },
    ],
    selectedValue: 'apple',
    onSelect: fn(),
    placeholder: 'Choose a fruit',
    showCheckmark: true,
    fullWidth: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls panel to interact with this dropdown. All selection events will be logged in the Actions panel.',
      },
    },
  },
}

export const EmptyOptions: Story = {
  args: {
    options: [],
    selectedValue: null,
    onSelect: fn(),
    placeholder: 'No options available',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const NonAbsoluteDropdown: Story = {
  args: {
    options: [
      { label: 'すべて', value: null },
      { label: '15分以内', value: 15 },
      { label: '30分以内', value: 30 },
      { label: '45分以内', value: 45 },
    ],
    selectedValue: null,
    onSelect: fn(),
    placeholder: '調理時間から探す',
    icon: <TimerIcon />,
    absoluteDropdown: false,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Non-absolute dropdown that expands within the document flow. Useful for navigation menus where absolute positioning might cause overflow issues.',
      },
    },
  },
}

// Fixed title example
export const WithFixedTitle: Story = {
  args: {
    options: [
      { label: '新しい順', value: 'date-desc' },
      { label: '古い順', value: 'date-asc' },
      { label: '名前順', value: 'alphabetical' },
    ],
    selectedValue: 'date-desc',
    onSelect: fn(),
    title: '並び替え',
    icon: <SortIcon />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown with a fixed title that doesn't change when selection changes. Useful for filter dropdowns where you want to keep the label consistent.",
      },
    },
  },
}

export const TitleVsDynamicLabel: Story = {
  render: () => {
    const options: DropdownOption<string>[] = [
      { label: '15分以内', value: '15' },
      { label: '30分以内', value: '30' },
      { label: '45分以内', value: '45' },
    ]

    return (
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ marginBottom: '8px' }}>Fixed Title</h4>
          <Dropdown
            options={options}
            selectedValue="15"
            onSelect={fn()}
            title="調理時間"
            icon={<TimerIcon />}
          />
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Always shows &quot;調理時間&quot;
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '8px' }}>Dynamic Label</h4>
          <Dropdown
            options={options}
            selectedValue="15"
            onSelect={fn()}
            placeholder="調理時間"
            icon={<TimerIcon />}
          />
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Shows selected option &quot;15分以内&quot;
          </p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comparison showing the difference between fixed title and dynamic label based on selection.',
      },
    },
  },
}

export const AbsoluteVsNonAbsolute: Story = {
  render: () => {
    const options: DropdownOption<string>[] = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ]

    return (
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ marginBottom: '8px' }}>Absolute (default)</h4>
          <Dropdown
            options={options}
            selectedValue="option1"
            onSelect={fn()}
            placeholder="Select option"
            absoluteDropdown={true}
          />
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Dropdown overlays content below
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '8px' }}>Non-absolute</h4>
          <Dropdown
            options={options}
            selectedValue="option1"
            onSelect={fn()}
            placeholder="Select option"
            absoluteDropdown={false}
          />
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            Dropdown pushes content down
          </p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comparison showing the difference between absolute and non-absolute dropdown positioning.',
      },
    },
  },
}
