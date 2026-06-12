import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { H2 } from '@/components/ui'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Directions = ({ recipe }: RecipeDetailProps) => {
  return (
    <DirectionsSection aria-labelledby="directions-heading">
      <H2 id="directions-heading">作り方</H2>
      {recipe.directions && recipe.directions.length > 0 ? (
        <DirectionsList>
          {recipe.directions.map((direction, index) => (
            <DirectionStep key={index} role="listitem">
              <StepNumber aria-label={`ステップ ${index + 1}`}>
                {index + 1}
              </StepNumber>

              <StepContent>
                {direction.title && <StepTitle>{direction.title}</StepTitle>}
                {direction.description && (
                  <StepDescription>{direction.description}</StepDescription>
                )}
              </StepContent>
            </DirectionStep>
          ))}
        </DirectionsList>
      ) : (
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyText>まだ手順が追加されていません</EmptyText>
        </EmptyState>
      )}
    </DirectionsSection>
  )
}

const DirectionsSection = styled.section`
  margin-block: ${({ theme }) => theme.spacing[6]};
`

const DirectionsList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`

const DirectionStep = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 1px 3px rgb(0, 0, 0, 0.05);
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:not(:last-child)::after {
    position: absolute;
    bottom: -${({ theme }) => theme.spacing[4]};
    left: 20px;
    z-index: 1;
    width: 2px;
    height: ${({ theme }) => theme.spacing[4]};
    content: '';
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.primary}40,
      transparent
    );
  }
`

const StepNumber = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1;
  color: ${({ theme }) => theme.colors.primary};
`

const StepContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  min-width: 0;
`

const StepTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray[900]};
  letter-spacing: -0.025em;
`

const StepDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: pre-wrap;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
  text-align: center;
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

const EmptyIcon = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-size: 48px;
  opacity: 0.6;
`

const EmptyText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
`
