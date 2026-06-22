import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { Caption } from '@/components/ui'

type RecipeDetailProps = {
  recipe: Recipe
}

const asHttpUrl = (source: string) => {
  try {
    const url = new URL(source)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

export const Source = ({ recipe }: RecipeDetailProps) => {
  if (!recipe.source) return null

  const url = asHttpUrl(recipe.source)

  return (
    <Section>
      <SourceText>
        参考：
        {url ? (
          <SourceLink href={url.href} target="_blank" rel="noopener noreferrer">
            {recipe.source}
          </SourceLink>
        ) : (
          recipe.source
        )}
      </SourceText>
    </Section>
  )
}

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing[8]};
`

const SourceText = styled(Caption)`
  overflow-wrap: anywhere;
`

const SourceLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
`
