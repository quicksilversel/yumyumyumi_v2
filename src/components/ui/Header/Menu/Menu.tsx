import { useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { BookmarkFilter } from './BookmarkFilter'
import { CookingTimeFilter } from './CookingTimeFilter'
import { TagFilter } from './TagFilter'

export const Menu = (props: { setSlideMenuOpen: (open: boolean) => void }) => {
  const searchParams = useSearchParams()

  const [selectedCookingTime, setSelectedCookingTime] = useState<number | null>(
    searchParams.get('maxCookingTime')
      ? Number(searchParams.get('maxCookingTime'))
      : null,
  )

  const [showBookmarked, setShowBookmarked] = useState(
    searchParams.get('bookmarked') === 'true',
  )

  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get('tag')
      ? decodeURIComponent(searchParams.get('tag')!)
      : null,
  )

  return (
    <>
      <TagFilter
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        {...props}
      />
      <CookingTimeFilter
        selectedCookingTime={selectedCookingTime}
        setSelectedCookingTime={setSelectedCookingTime}
        {...props}
      />
      <BookmarkFilter
        showBookmarked={showBookmarked}
        setShowBookmarked={setShowBookmarked}
        {...props}
      />
    </>
  )
}
