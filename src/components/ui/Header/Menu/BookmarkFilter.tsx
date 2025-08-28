'use client'

import styled from '@emotion/styled'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext'

type Props = {
  showBookmarked: boolean
  setShowBookmarked: (show: boolean) => void
}

export const BookmarkFilter = ({
  showBookmarked,
  setShowBookmarked,
}: Props) => {
  const router = useRouter()
  const { user } = useAuth()

  const handleBookmarkToggle = () => {
    const newValue = !showBookmarked
    setShowBookmarked(newValue)

    if (newValue) {
      router.push('/?bookmarked=true')
    } else {
      router.push('/')
    }
  }

  if (!user) return null

  return (
    <FilterButton onClick={handleBookmarkToggle} active={showBookmarked}>
      {showBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      Bookmarks
    </FilterButton>
  )
}

const FilterButton = styled.button<{ active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.gray[700]};

  transition: background-color ${({ theme }) => theme.transition.fast};
  height: 40px;

  &:hover {
    background-color: rgba(245, 178, 172, 0.05);
  }

  svg {
    font-size: 18px;
    color: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.gray[500]};
  }
`
