import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DateRangeIcon from '@mui/icons-material/DateRange'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import Link from 'next/link'

import type { Recipe } from '@/types/recipe'

import { H1, Body, Flex, Chip, ChipGroup, Caption } from '@/components/ui'

export const Header = ({ recipe }: { recipe: Recipe }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA').replace(/-/g, '/')
  }

  return (
    <StyledFlex direction="column" gap={2}>
      {recipe.tags && recipe.tags.length > 0 && (
        <ChipGroup gap={2}>
          {recipe.tags.map((tag) => (
            <Link key={tag} href={`/?tag=${encodeURI(tag)}`}>
              <Chip clickable variant="outlined" size="sm">
                <LoyaltyIcon fontSize="inherit" />
                {tag}
              </Chip>
            </Link>
          ))}
        </ChipGroup>
      )}
      <H1>{recipe.title}</H1>
      {recipe.summary && (
        <Body size="sm" muted>
          {recipe.summary}
        </Body>
      )}
      <RecipeInfo gap={3}>
        <Flex align="center" gap={1}>
          <AccessTimeIcon />
          <Caption>{recipe.cookTime} min</Caption>
        </Flex>
        {recipe.createdAt && (
          <Flex align="center" gap={1}>
            <DateRangeIcon />
            <Caption> {formatDate(recipe.createdAt)}</Caption>
          </Flex>
        )}
      </RecipeInfo>
    </StyledFlex>
  )
}

const StyledFlex = styled(Flex)`
  position: relative;
  padding-block: ${({ theme }) => theme.spacing[6]};
`

const RecipeInfo = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};

  svg {
    font-size: 18px;
  }
`
