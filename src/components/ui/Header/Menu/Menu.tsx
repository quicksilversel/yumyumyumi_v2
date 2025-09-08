'use client'

import { useState, Suspense } from 'react'

import styled from '@emotion/styled'
import { useSearchParams } from 'next/navigation'

import { BookmarkFilter } from './BookmarkFilter'
import { CookingTimeFilter } from './CookingTimeFilter'

export const MenuInner = () => {
  const searchParams = useSearchParams()

  const [selectedCookingTime, setSelectedCookingTime] = useState<number | null>(
    searchParams.get('maxCookingTime')
      ? Number(searchParams.get('maxCookingTime'))
      : null,
  )

  const [showBookmarked, setShowBookmarked] = useState(
    searchParams.get('bookmarked') === 'true',
  )

  return (
    <Container>
      <CookingTimeFilter
        selectedCookingTime={selectedCookingTime}
        setSelectedCookingTime={setSelectedCookingTime}
      />
      <BookmarkFilter
        showBookmarked={showBookmarked}
        setShowBookmarked={setShowBookmarked}
      />
    </Container>
  )
}

const Container = styled.div``

const SearchAndFiltersFallback = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  height: 40px;
`

export function Menu() {
  return (
    <Suspense fallback={<SearchAndFiltersFallback />}>
      <MenuInner />
    </Suspense>
  )
}
