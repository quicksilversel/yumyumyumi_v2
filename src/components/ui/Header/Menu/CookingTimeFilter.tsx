import TimerIcon from '@mui/icons-material/Timer'
import { useRouter } from 'next/navigation'

import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown'

const cookingTimeOptions: DropdownOption<number | null>[] = [
  { label: 'すべて', value: null },
  { label: '15分以内', value: 15 },
  { label: '30分以内', value: 30 },
  { label: '45分以内', value: 45 },
  { label: '1時間以内', value: 60 },
]

type Props = {
  selectedCookingTime: number | null
  setSelectedCookingTime: (time: number | null) => void
}

export const CookingTimeFilter = ({
  selectedCookingTime,
  setSelectedCookingTime,
}: Props) => {
  const router = useRouter()

  const handleTimeSelect = (time: number | null) => {
    setSelectedCookingTime(time)
    if (time) {
      router.push(`/?maxCookingTime=${time}`)
    } else {
      router.push('/')
    }
  }

  return (
    <Dropdown
      options={cookingTimeOptions}
      selectedValue={selectedCookingTime}
      onSelect={handleTimeSelect}
      title="調理時間から探す"
      icon={<TimerIcon />}
      fullWidth
      absoluteDropdown={false}
    />
  )
}
