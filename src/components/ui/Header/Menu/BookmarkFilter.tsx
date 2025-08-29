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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  width: 100%;
  height: 40px;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: rgb(245, 178, 172, 5%);
  }

  svg {
    color: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.gray[500]};
    font-size: 18px;
  }
`
