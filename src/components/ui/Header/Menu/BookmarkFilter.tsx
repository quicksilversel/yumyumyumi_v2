import styled from '@emotion/styled'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
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
      {showBookmarked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
      お気に入りのレシピ
    </FilterButton>
  )
}

const FilterButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[3]};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
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
