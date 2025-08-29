import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CategoryIcon from '@mui/icons-material/Category'
import GroupIcon from '@mui/icons-material/Group'

import type { Recipe } from '@/types'

import { Flex } from '@/components/ui'

export const Info = ({ recipe }: { recipe: Recipe }) => {
  return (
    <HeaderSection>
      <InfoGrid>
        <InfoCard>
          <Flex direction="column" align="center" gap={1}>
            <CategoryIcon />
            <span>{recipe.category}</span>
          </Flex>
        </InfoCard>
        <InfoCard>
          <Flex direction="column" align="center" gap={1}>
            <AccessTimeIcon />
            <span>{recipe.totalTime} min</span>
          </Flex>
        </InfoCard>
        <InfoCard>
          <Flex direction="column" align="center" gap={1}>
            <GroupIcon />
            <span>{recipe.servings} Servings</span>
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

  @media (width <= 35.1875rem) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
`

const InfoCard = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
`
