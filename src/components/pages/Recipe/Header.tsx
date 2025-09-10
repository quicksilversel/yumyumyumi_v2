import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DateRangeIcon from '@mui/icons-material/DateRange'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import Link from 'next/link'

import type { Recipe } from '@/types/recipe'

import { H1, Body, Flex, Chip, ChipGroup, Caption } from '@/components/ui'

import { Hero } from './Hero'

export const Header = ({ recipe }: { recipe: Recipe }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <HeroSection>
      <ContentWrapper>
        <ContentGrid>
          <TextContent>
            {recipe.tags && recipe.tags.length > 0 && (
              <ChipGroup gap={2}>
                {recipe.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?tag=${encodeURI(tag)}`}
                    title={`${tag}のレシピ一覧へ`}
                  >
                    <Chip clickable variant="outlined" size="sm">
                      <LoyaltyIcon fontSize="inherit" />
                      {tag}
                    </Chip>
                  </Link>
                ))}
              </ChipGroup>
            )}
            <TitleGroup>
              <H1>{recipe.title}</H1>
              {recipe.summary && <Summary>{recipe.summary}</Summary>}
            </TitleGroup>
            <MetaInfo>
              <Flex align="center" gap={1}>
                <AccessTimeIcon />
                <Caption>{recipe.cookTime}分</Caption>
              </Flex>
              {recipe.servings && (
                <Flex align="center" gap={1}>
                  <LocalDiningIcon />
                  <Caption>{recipe.servings}人分</Caption>
                </Flex>
              )}
              {recipe.createdAt && (
                <Flex align="center" gap={1}>
                  <DateRangeIcon />
                  <Caption>{formatDate(recipe.createdAt)}</Caption>
                </Flex>
              )}
            </MetaInfo>
          </TextContent>
          <Hero recipe={recipe} />
        </ContentGrid>
      </ContentWrapper>
    </HeroSection>
  )
}

const HeroSection = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const ContentWrapper = styled.div`
  margin: 0 auto;

  @media (width > 35.1875rem) {
    padding-block: ${({ theme }) => theme.spacing[6]};
  }
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: center;

  @media (width < 35.1875rem) {
    grid-template-rows: auto auto;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (width < 35.1875rem) {
    order: 2;
    margin-inline: ${({ theme }) => theme.spacing[4]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`

const Summary = styled(Body)`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray[600]};
`

const MetaInfo = styled(Flex)`
  gap: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};

  svg {
    font-size: 18px;
  }

  @media (width < 35.1875rem) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`
