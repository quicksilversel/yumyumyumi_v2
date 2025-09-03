'use client'

import { useState } from 'react'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import { useFormContext, Controller } from 'react-hook-form'

import type { RecipeForm } from '@/types'

import { Button } from '@/components/ui/Button'
import { Chip, ChipGroup } from '@/components/ui/Chip'
import { Input } from '@/components/ui/Forms/Input'
import { Flex, Stack } from '@/components/ui/Layout'
import { H6, Caption } from '@/components/ui/Typography'
import { spacing } from '@/styles/designTokens'

export function TagsForm() {
  const { control, watch, setValue } = useFormContext<RecipeForm>()
  const [tagInput, setTagInput] = useState('')

  const tags = watch('tags') || []

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()])
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
    setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove),
    )
  }

  return (
    <Controller
      name="tags"
      control={control}
      render={() => (
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
              type="button"
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
                <Chip
                  key={tag}
                  size="md"
                  clickable
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Chip>
              ))}
            </ChipGroup>
          )}
        </Stack>
      )}
    />
  )
}

const TagInputRow = styled(Flex)`
  width: 100%;
  gap: ${spacing[2]};
`
