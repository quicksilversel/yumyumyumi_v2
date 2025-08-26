'use client'

import { useState } from 'react'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'

import { Button } from '@/components/ui/Button'
import { Chip, ChipGroup } from '@/components/ui/Chip'
import { Input, FormField } from '@/components/ui/Input'
import { Flex, Stack } from '@/components/ui/Layout'
import { H6, Caption } from '@/components/ui/Typography'
import { spacing } from '@/styles/designTokens'

const TagInputRow = styled(Flex)`
  gap: ${spacing[2]};
`

type TagsFormProps = {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function TagsForm({ tags, onChange }: TagsFormProps) {
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onChange([...tags, tagInput.trim()])
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
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Stack gap={3}>
      <H6>Tags</H6>

      <FormField style={{ marginBottom: 0 }}>
        <TagInputRow>
          <Input
            placeholder="Add a tag (e.g., 'vegetarian', 'quick')"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
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
      </FormField>

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
