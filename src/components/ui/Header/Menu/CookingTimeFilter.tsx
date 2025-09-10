import TimerIcon from '@mui/icons-material/Timer'
import { useRouter, useSearchParams } from 'next/navigation'

import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown'

const COOK_TIME_OPTIONS: DropdownOption<number | null>[] = [
  { label: 'すべて', value: null },
  { label: '15分以内', value: 15 },
  { label: '30分以内', value: 30 },
  { label: '45分以内', value: 45 },
  { label: '1時間以内', value: 60 },
] as const

type Props = {
  selectedCookingTime: number | null
  setSelectedCookingTime: (time: number | null) => void
  setSlideMenuOpen: (open: boolean) => void
}

export const CookingTimeFilter = ({
  selectedCookingTime,
  setSelectedCookingTime,
  setSlideMenuOpen,
}: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTimeSelect = (time: number | null) => {
    setSelectedCookingTime(time)
    setSlideMenuOpen(false)

    const params = new URLSearchParams(searchParams.toString())

    if (time === null) {
      params.delete('maxCookingTime')
    } else {
      params.set('maxCookingTime', time.toString())
    }

    const queryString = params.toString()
    router.push(queryString ? `/?${queryString}` : '/')
  }

  return (
    <Dropdown
      options={COOK_TIME_OPTIONS}
      selectedValue={selectedCookingTime}
      onSelect={handleTimeSelect}
      placeholder="調理時間から探す"
      icon={<TimerIcon />}
      fullWidth
      absoluteDropdown={false}
    />
  )
}
