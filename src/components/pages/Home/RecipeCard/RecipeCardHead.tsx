import styled from '@emotion/styled'
import Image from 'next/image'

import type { Recipe } from '@/types'

import { Chip } from '@/components/ui/Chip'

export const RecipeCardHead = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Container>
      <Image
        src={
          recipe.imageUrl ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
        }
        alt={recipe.title}
        fill
        objectFit="cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <MediaGradient />
      <CategoryChip size="sm">{recipe.category}</CategoryChip>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  overflow: hidden;
`

const MediaGradient = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 60%;
  background: linear-gradient(to top, rgb(0, 0, 0, 60%) 0%, transparent 100%);
  pointer-events: none;
`

const CategoryChip = styled(Chip)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing[3]};
  left: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
`
