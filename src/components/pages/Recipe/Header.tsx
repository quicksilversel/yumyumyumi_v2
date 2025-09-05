import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

import type { Recipe } from '@/types/recipe'

import { H1, Body, Flex, Chip, Label } from '@/components/ui'

export const Header = ({ recipe }: { recipe: Recipe }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA').replace(/-/g, '/')
  }

  return (
    <StyledFlex direction="column" gap={2}>
      <Chip size="sm" variant="outlined">
        <AccessTimeIcon fontSize="small" />
        {recipe.cookTime} min
      </Chip>
      <H1>{recipe.title}</H1>
      {recipe.summary && (
        <Body size="sm" muted>
          {recipe.summary}
        </Body>
      )}
      {recipe.createdAt && <Label>{formatDate(recipe.createdAt)}</Label>}
    </StyledFlex>
  )
}

const StyledFlex = styled(Flex)`
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing[8]};
  margin-block: ${({ theme }) => theme.spacing[6]};
`
