import { useEffect, useState } from 'react'

import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { useRouter } from 'next/navigation'

import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown'
import { getAllTagsFromRecipes } from '@/lib/supabase/tables/recipe/getAllTagsFromRecipes/getAllTagsFromRecipes'

type Props = {
  selectedTag: string | null
  setSelectedTag: (tag: string | null) => void
}

export const TagFilter = ({ selectedTag, setSelectedTag }: Props) => {
  const router = useRouter()
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTagsFromRecipes()
        setAvailableTags(tags)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch tags:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [])

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
    if (tag) {
      router.push(`/?tag=${encodeURIComponent(tag)}`)
    } else {
      router.push('/')
    }
  }

  const tagOptions: DropdownOption<string | null>[] = [
    { label: 'すべて', value: null },
    ...availableTags.map((tag) => ({ label: tag, value: tag })),
  ]

  if (isLoading) {
    return (
      <Dropdown
        options={[{ label: '読み込み中...', value: null }]}
        selectedValue={null}
        onSelect={() => {}}
        placeholder="タグから探す"
        icon={<LocalOfferIcon />}
        fullWidth
        absoluteDropdown={false}
      />
    )
  }

  return (
    <Dropdown
      options={tagOptions}
      selectedValue={selectedTag}
      onSelect={handleTagSelect}
      placeholder="タグから探す"
      icon={<LocalOfferIcon />}
      fullWidth
      absoluteDropdown={false}
    />
  )
}
