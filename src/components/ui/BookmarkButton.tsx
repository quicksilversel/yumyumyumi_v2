import styled from '@emotion/styled'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'

import { IconButton } from '@/components/ui/Button'
import { useBookmarks } from '@/hooks/useBookmarks'

interface BookmarkButtonProps {
  recipeId: string
  size?: 'sm' | 'md' | 'lg'
  onToggle?: () => void
  className?: string
}

export const BookmarkButton = ({
  recipeId,
  size = 'sm',
  onToggle,
  className,
}: BookmarkButtonProps) => {
  const { isBookmarked, toggleBookmark, isLoading, isToggling } = useBookmarks({
    recipeId,
    onToggle,
  })

  return (
    <StyledIconButton
      onClick={toggleBookmark}
      size={size}
      className={className}
      disabled={isLoading || isToggling}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </StyledIconButton>
  )
}

const StyledIconButton = styled(IconButton)`
  background-color: rgb(255, 255, 255, 90%);
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgb(255, 255, 255, 95%);
  }
`
