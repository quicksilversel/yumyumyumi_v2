import { useEffect, useState } from 'react'

import styled from '@emotion/styled'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'

import { IconButton } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
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
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const { isBookmarked, toggleBookmark, isLoading, isToggling } = useBookmarks({
    recipeId,
    onToggle,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isProcessing || isToggling) return
    
    setIsProcessing(true)
    try {
      await toggleBookmark(e)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!mounted || loading || !user) {
    return null
  }

  return (
    <StyledIconButton
      onClick={handleToggle}
      size={size}
      className={className}
      disabled={isLoading || isToggling || isProcessing}
      aria-label={
        isBookmarked ? 'お気に入りレシピから外す' : 'お気に入りレシピに追加する'
      }
      title={
        isBookmarked ? 'お気に入りレシピから外す' : 'お気に入りレシピに追加する'
      }
      type="button"
    >
      {isBookmarked ? (
        <FavoriteIcon fontSize="inherit" />
      ) : (
        <FavoriteBorderOutlinedIcon fontSize="inherit" />
      )}
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
