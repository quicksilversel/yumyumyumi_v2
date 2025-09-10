import { useState, Suspense } from 'react'

import styled from '@emotion/styled'
import { useSearchParams } from 'next/navigation'

import { BookmarkFilter } from './BookmarkFilter'
import { CookingTimeFilter } from './CookingTimeFilter'
import { TagFilter } from './TagFilter'

export const MenuInner = (props: {
  setSlideMenuOpen: (open: boolean) => void
}) => {
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

const SearchAndFiltersFallback = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  height: 40px;
`

export function Menu(props: { setSlideMenuOpen: (open: boolean) => void }) {
  return (
    <Suspense fallback={<SearchAndFiltersFallback />}>
      <MenuInner {...props} />
    </Suspense>
  )
}
