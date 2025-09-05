import styled from '@emotion/styled'
import Link from 'next/link'

import type { Recipe } from '@/types/recipe'

import { Chip, ChipGroup } from '@/components/ui'

export const Tags = ({ recipe }: { recipe: Recipe }) => {
  return (
    <HeaderSection>
      {recipe.tags && recipe.tags.length > 0 && (
        <ChipGroup>
          {recipe.tags.map((tag) => (
            <Link key={tag} href={`/?tag=${encodeURI(tag)}`}>
              <Chip>{tag}</Chip>
            </Link>
          ))}
        </ChipGroup>
      )}
    </HeaderSection>
  )
}

const HeaderSection = styled.div`
  margin-block: ${({ theme }) => theme.spacing[8]};
`
