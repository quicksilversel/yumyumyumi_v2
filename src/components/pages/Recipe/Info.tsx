'use client'

import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CategoryIcon from '@mui/icons-material/Category'
import GroupIcon from '@mui/icons-material/Group'

import type { Recipe } from '@/types'

import { Flex, Body, Label } from '@/components/ui'
type RecipeDetailProps = {
  recipe: Recipe
}

export const Info = ({ recipe }: RecipeDetailProps) => {
  return (
    <HeaderSection>
      <InfoGrid>
        <InfoCard>
          <Flex direction="column" align="center" gap={1}>
            <CategoryIcon />
            <Label>Category</Label>
            <Body>{recipe.category}</Body>
          </Flex>
        </InfoCard>

        <InfoCard>
          <Flex direction="column" align="center" gap={1}>
            <AccessTimeIcon />
            <Label>Total Time</Label>
            <Body>{recipe.totalTime} min</Body>
          </Flex>
        </InfoCard>

        <InfoCard>
          <Flex direction="column" align="center" gap={1}>
            <GroupIcon />
            <Label>Servings</Label>
            <Body>{recipe.servings}</Body>
          </Flex>
        </InfoCard>
      </InfoGrid>
    </HeaderSection>
  )
}

const HeaderSection = styled.div`
  margin-block: ${({ theme }) => theme.spacing[4]};
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const InfoCard = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
`
