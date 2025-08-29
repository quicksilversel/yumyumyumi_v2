import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { H1, Body } from '@/components/ui'

export const Header = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Container>
      <H1>{recipe.title}</H1>
      {recipe.summary && <Body muted>{recipe.summary}</Body>}
    </Container>
  )
}

const Container = styled.section`
  margin-block: ${({ theme }) => theme.spacing[4]};
`
