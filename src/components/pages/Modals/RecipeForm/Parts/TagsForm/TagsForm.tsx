import { useState } from 'react'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import {
  Caption,
  Flex,
  Stack,
  Chip,
  Input,
  ChipGroup,
  Button,
} from '@/components/ui'

export const TagsForm = () => {
  const { watch, setValue, register } = useFormContext<RecipeForm>()
  const [tagInput, setTagInput] = useState('')

  const tags = watch('tags') || []

  const tagsRegistration = register('tags')

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()]
      setValue('tags', newTags)
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
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    setValue('tags', newTags)
  }

  return (
    <Stack gap={3}>
      <input type="hidden" {...tagsRegistration} value={JSON.stringify(tags)} />
      <TagInputRow>
        <Input
          title="Tags"
          placeholder="タグの入力後、Enterキーを押してください"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddTag}
          disabled={!tagInput.trim()}
          type="button"
        >
          <AddIcon fontSize="inherit" />
        </Button>
      </TagInputRow>
      {tags.length === 0 ? (
        <Caption>まだタグが追加されていません。</Caption>
      ) : (
        <ChipGroup gap={2}>
          {tags.map((tag) => (
            <Chip key={tag} size="sm" clickable onClick={() => removeTag(tag)}>
              {tag} ×
            </Chip>
          ))}
        </ChipGroup>
      )}
    </Stack>
  )
}

const TagInputRow = styled(Flex)`
  width: 100%;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: flex-end;
`
