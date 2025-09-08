import styled from '@emotion/styled'
import Image from 'next/image'

import type { Recipe } from '@/types/recipe'

export const RecipeCardHead = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Container>
      <Image
        src={
          recipe.imageUrl ||
          'https://images.unsplash.com/photo-1614597330453-ecf2c06e1f55?w=800'
        }
        alt={recipe.title}
        fill
        objectFit="cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <MediaGradient />
      {recipe.tags?.[0] && <Label>{recipe.tags[0]}</Label>}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  overflow: hidden;
`

const MediaGradient = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 60%;
  background: linear-gradient(to top, rgb(0, 0, 0, 30%) 0%, transparent 100%);
  pointer-events: none;
`

const Label = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`
