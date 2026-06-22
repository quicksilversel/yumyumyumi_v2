import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { RecipeImage } from '@/components/ui/RecipeImage'

export const RecipeCardHead = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Container>
      <RecipeImage
        src={recipe.imageUrl}
        alt={recipe.title}
        seed={recipe.id}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {recipe.tags?.[0] && <Label>{recipe.tags[0]}</Label>}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[100]};
`

const Label = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[2]};
  left: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`
