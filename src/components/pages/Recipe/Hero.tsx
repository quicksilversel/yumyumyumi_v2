import styled from '@emotion/styled'
import Image from 'next/image'

import type { Recipe } from '@/types'

import { spacing, borderRadius } from '@/styles/designTokens'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Hero = ({ recipe }: RecipeDetailProps) => {
  return (
    <ImageContainer>
      <Image
        src={
          recipe.imageUrl ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
        }
        alt={recipe.title}
        fill
        style={{ objectFit: 'cover' }}
        priority
        sizes="(max-width: 1200px) 100vw, 1200px"
      />
    </ImageContainer>
  )
}

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${spacing[8]};
`
