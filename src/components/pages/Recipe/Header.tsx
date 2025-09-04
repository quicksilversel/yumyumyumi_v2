import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

import type { Recipe } from '@/types/recipe'

import { H1, Body, Flex, Chip } from '@/components/ui'

export const Header = ({ recipe }: { recipe: Recipe }) => {
  return (
    <StyledFlex direction="column" gap={2}>
      <Chip size="sm" variant="outlined">
        <AccessTimeIcon fontSize="small" />
        {recipe.cookTime} min
      </Chip>
      <H1>{recipe.title}</H1>
      {recipe.summary && <Body muted>{recipe.summary}</Body>}
    </StyledFlex>
  )
}

const StyledFlex = styled(Flex)`
  margin-block: ${({ theme }) => theme.spacing[4]};
`
