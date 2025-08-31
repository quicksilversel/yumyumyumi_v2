'use client'

import { useState } from 'react'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'

import { Button } from '@/components/ui/Button'
import { Chip, ChipGroup } from '@/components/ui/Chip'
import { Input } from '@/components/ui/Forms/Input'
import { Flex, Stack } from '@/components/ui/Layout'
import { H6, Caption } from '@/components/ui/Typography'
import { useRecipeForm } from '@/contexts/RecipeFormContext'
import { spacing } from '@/styles/designTokens'

const TagInputRow = styled(Flex)`
  gap: ${spacing[2]};
`

type Props = {
  mode: 'new' | 'edit'
}

export function TagsForm({ mode }: Props) {
  const { recipe, setRecipe } = useRecipeForm(mode)
  const tags = recipe.tags || []
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setRecipe((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const removeTag = (tagToRemove: string) => {
    setRecipe((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <Stack gap={3}>
      <H6>Tags</H6>

      <TagInputRow>
        <Input
          placeholder="Add a tag (e.g., 'vegetarian', 'quick')"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddTag}
          disabled={!tagInput.trim()}
        >
          <AddIcon />
          Add
        </Button>
      </TagInputRow>

      {tags.length === 0 ? (
        <Caption>No tags added yet.</Caption>
      ) : (
        <ChipGroup gap={2}>
          {tags.map((tag) => (
            <Chip key={tag} size="md" clickable onClick={() => removeTag(tag)}>
              {tag} ×
            </Chip>
          ))}
        </ChipGroup>
      )}
    </Stack>
  )
}
