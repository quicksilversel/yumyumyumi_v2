import { useState } from 'react'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import { useFormContext, Controller } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import {
  H2,
  Caption,
  Flex,
  Stack,
  Chip,
  Input,
  ChipGroup,
  Button,
} from '@/components/ui'

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
          <H2>Tags</H2>

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
  gap: ${({ theme }) => theme.spacing[2]};
`
