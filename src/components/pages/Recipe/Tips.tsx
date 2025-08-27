'use client'

import styled from '@emotion/styled'
import InfoIcon from '@mui/icons-material/Info'

import type { Recipe } from '@/types'

import { Container, Stack, Flex } from '@/components/ui'
import { H2, Body } from '@/components/ui'
import { colors } from '@/styles/designTokens'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Tips = ({ recipe }: RecipeDetailProps) => {
  if (!recipe.tips) return null

  return (
    <Container>
      <TipsBox>
        <Flex gap={2} align="start">
          <InfoIcon style={{ color: colors.warning }} />
          <Stack gap={1}>
            <H2>Tips</H2>
            <Body>{recipe.tips}</Body>
          </Stack>
        </Flex>
      </TipsBox>
    </Container>
  )
}

const TipsBox = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.warning}20;
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[6]};
`
