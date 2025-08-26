'use client'

import { useState, useEffect } from 'react'

import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import CategoryIcon from '@mui/icons-material/Category'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import InfoIcon from '@mui/icons-material/Info'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { Recipe } from '@/types'

import { useAuth } from '@/contexts/AuthContext'
import { isBookmarked, toggleBookmark } from '@/lib/supabase/bookmarkService'
import { deleteRecipe } from '@/lib/supabase/supabaseRecipeService'
import {
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/styles/designTokens'

import { EditRecipeDialog } from './EditRecipeDialog'
import { Button, IconButton } from './ui/Button'
import { Chip, ChipGroup } from './ui/Chip'
import { Dialog } from './ui/Dialog'
import { Container, Stack, Flex, Divider } from './ui/Layout'
import { H1, H5, H6, Body, Label, Caption } from './ui/Typography'

type RecipeDetailProps = {
  recipe: Recipe
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isBookmarkedState, setIsBookmarkedState] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState(recipe)

  const isOwner = user && currentRecipe.user_id === user.id

  // Initialize bookmark state after mount to avoid hydration mismatch
  useEffect(() => {
    setIsBookmarkedState(isBookmarked(recipe.id))
  }, [recipe.id])

  const handleBookmarkClick = () => {
    const newState = toggleBookmark(currentRecipe.id)
    setIsBookmarkedState(newState)
  }

  const handleEdit = () => {
    setEditDialogOpen(true)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const success = await deleteRecipe(currentRecipe.id)
    if (success) {
      router.push('/')
    } else {
      alert('Failed to delete recipe')
    }
    setIsDeleting(false)
    setDeleteDialogOpen(false)
  }

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setCurrentRecipe(updatedRecipe)
    window.location.reload()
  }

  return (
    <Container>
      <Stack gap={4}>
        <Flex justify="between" align="center">
          <Link href="/">
            <Button variant="ghost">
              <ArrowBackIcon />
              Back to Recipes
            </Button>
          </Link>
          {isOwner && (
            <Flex gap={2}>
              <Button variant="secondary" onClick={handleEdit}>
                <EditIcon />
                Edit
              </Button>
              <Button variant="ghost" onClick={() => setDeleteDialogOpen(true)}>
                <DeleteIcon />
                Delete
              </Button>
            </Flex>
          )}
        </Flex>

        <HeroImage>
          <Image
            src={currentRecipe.imageUrl}
            alt={currentRecipe.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </HeroImage>

        <HeaderSection>
          <Flex justify="between" align="start">
            <Stack gap={2}>
              <H1>{currentRecipe.title}</H1>
              <Body>{currentRecipe.summary}</Body>

              {currentRecipe.source && (
                <Caption>
                  Source:{' '}
                  {currentRecipe.source.startsWith('http') ? (
                    <a
                      href={currentRecipe.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: colors.info }}
                    >
                      {new URL(currentRecipe.source).hostname}
                    </a>
                  ) : (
                    currentRecipe.source
                  )}
                </Caption>
              )}
            </Stack>

            <IconButton
              size="lg"
              onClick={handleBookmarkClick}
              aria-label={
                isBookmarkedState ? 'Remove bookmark' : 'Add bookmark'
              }
            >
              {isBookmarkedState ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Flex>

          <InfoGrid>
            <InfoCard>
              <Flex direction="column" align="center" gap={1}>
                <CategoryIcon />
                <Label>Category</Label>
                <Body>{currentRecipe.category}</Body>
              </Flex>
            </InfoCard>

            <InfoCard>
              <Flex direction="column" align="center" gap={1}>
                <AccessTimeIcon />
                <Label>Total Time</Label>
                <Body>{currentRecipe.totalTime} min</Body>
              </Flex>
            </InfoCard>

            <InfoCard>
              <Flex direction="column" align="center" gap={1}>
                <GroupIcon />
                <Label>Servings</Label>
                <Body>{currentRecipe.servings}</Body>
              </Flex>
            </InfoCard>
          </InfoGrid>

          {currentRecipe.tags && currentRecipe.tags.length > 0 && (
            <ChipGroup>
              {currentRecipe.tags.map((tag, index) => (
                <Chip key={index}>{tag}</Chip>
              ))}
            </ChipGroup>
          )}
        </HeaderSection>

        <Divider />

        <Section>
          <H5>Ingredients</H5>
          <Stack gap={2}>
            {currentRecipe.ingredients?.map((ingredient, index) => (
              <IngredientItem key={index}>
                <Flex justify="between" align="center">
                  <Body>{ingredient.name}</Body>
                  <Label>
                    {ingredient.amount} {ingredient.unit}
                  </Label>
                </Flex>
                {ingredient.isSpice && (
                  <Caption style={{ color: colors.gray[600] }}>Spice</Caption>
                )}
              </IngredientItem>
            ))}
          </Stack>
        </Section>

        <Divider />

        <Section>
          <H5>Directions</H5>
          <Stack gap={3}>
            {currentRecipe.directions?.map((direction, index) => (
              <DirectionItem key={index}>
                <StepNumber>{index + 1}</StepNumber>
                {direction.title && <H6>{direction.title}</H6>}
                <Body>{direction.description}</Body>
              </DirectionItem>
            ))}
          </Stack>
        </Section>

        {currentRecipe.tips && (
          <>
            <Divider />
            <Section>
              <TipsBox>
                <Flex gap={2} align="start">
                  <InfoIcon style={{ color: colors.warning }} />
                  <Stack gap={1}>
                    <H6>Tips</H6>
                    <Body>{currentRecipe.tips}</Body>
                  </Stack>
                </Flex>
              </TipsBox>
            </Section>
          </>
        )}
      </Stack>

      {/* Edit Dialog */}
      <EditRecipeDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        recipe={currentRecipe}
        onRecipeUpdated={handleRecipeUpdated}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title={<H5>Delete Recipe</H5>}
        actions={
          <DialogActions>
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        }
      >
        <DialogContent>
          <Body>
            Are you sure you want to delete &quot;{currentRecipe.title}&quot;?
            This action cannot be undone.
          </Body>
        </DialogContent>
      </Dialog>
    </Container>
  )
}

const HeroImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${spacing[8]};
`

const HeaderSection = styled.div`
  margin-bottom: ${spacing[8]};
`

const Section = styled.div`
  margin-bottom: ${spacing[8]};
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};
`

const InfoCard = styled.div`
  padding: ${spacing[4]};
  background-color: ${colors.gray[50]};
  border-radius: ${borderRadius.md};
  text-align: center;
`

const IngredientItem = styled.div`
  padding: ${spacing[3]} ${spacing[4]};
  margin-bottom: ${spacing[2]};
  background-color: ${colors.gray[50]};
  border-radius: ${borderRadius.md};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.gray[100]};
  }
`

const DirectionItem = styled.div`
  padding: ${spacing[4]};
  margin-bottom: ${spacing[3]};
  background-color: ${colors.white};
  border: 1px solid ${colors.gray[200]};
  border-radius: ${borderRadius.md};
  position: relative;
  padding-left: ${spacing[12]};
`

const StepNumber = styled.div`
  position: absolute;
  left: ${spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: ${colors.black};
  color: ${colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.sm};
`

const TipsBox = styled.div`
  padding: ${spacing[4]};
  background-color: ${colors.warning}20;
  border: 1px solid ${colors.warning};
  border-radius: ${borderRadius.md};
  margin-top: ${spacing[6]};
`

const DialogContent = styled.div`
  padding: ${spacing[4]};
`

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing[3]};
  margin-top: ${spacing[6]};
`
