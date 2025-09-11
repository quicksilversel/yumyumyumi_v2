import { useState } from 'react'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Input, Button, Caption } from '@/components/ui'

export const TagsForm = () => {
  const { watch, setValue, register } = useFormContext<RecipeForm>()
  const [tagInput, setTagInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const tags = watch('tags') || []
  const tagsRegistration = register('tags')

  const validateTag = (tag: string): string | null => {
    const trimmedTag = tag.trim()

    if (!trimmedTag) {
      return 'タグを入力してください'
    }

    if (trimmedTag.length > 20) {
      return 'タグは20文字以内で入力してください'
    }

    if (tags.includes(trimmedTag)) {
      return 'このタグは既に追加されています'
    }

    if (tags.length >= 10) {
      return 'タグは最大10個まで追加できます'
    }

    return null
  }

  const handleAddTag = () => {
    const error = validateTag(tagInput)

    if (error) {
      setErrorMessage(error)
      return
    }

    const newTags = [...tags, tagInput.trim()]
    setValue('tags', newTags)
    setTagInput('')
    setErrorMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isComposing) {
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Escape') {
      setTagInput('')
      setErrorMessage('')
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value)
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    setValue('tags', newTags)
  }

  const handleTagKeyDown = (e: React.KeyboardEvent, tag: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      removeTag(tag)
    }
  }

  return (
    <TagSection>
      <SectionHeader>
        <SectionTitle id="tags-heading">タグ</SectionTitle>
        <TagCounter aria-live="polite">{tags.length}/10 タグ</TagCounter>
      </SectionHeader>
      <input type="hidden" {...tagsRegistration} value={JSON.stringify(tags)} />
      <TagInputContainer>
        <TagInputWrapper>
          <Input
            id="tag-input"
            title="新しいタグ"
            placeholder="タグを入力してEnterキーまたは追加ボタンを押してください"
            value={tagInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            error={!!errorMessage}
            aria-describedby="tag-input-help tag-input-error"
            maxLength={20}
          />
          {errorMessage && (
            <ErrorMessage id="tag-input-error" role="alert">
              {errorMessage}
            </ErrorMessage>
          )}
        </TagInputWrapper>

        <AddTagButton
          variant="primary"
          onClick={handleAddTag}
          disabled={!tagInput.trim() || tags.length >= 10}
          type="button"
          aria-label="タグを追加"
        >
          <AddIcon fontSize="inherit" />
          追加
        </AddTagButton>
      </TagInputContainer>

      <HelpText id="tag-input-help">
        Enterキー、Escapeキーでの操作に対応。タグをクリックして削除できます。
      </HelpText>
      <TagsContainer>
        {tags.length === 0 ? (
          <EmptyState>
            <Caption id="ingredients-help">
              まだタグが追加されていません。レシピを分類するためのタグを追加しましょう。
            </Caption>
          </EmptyState>
        ) : (
          <TagList
            role="list"
            aria-labelledby="tags-heading"
            aria-live="polite"
          >
            {tags.map((tag) => (
              <TagItem key={tag} role="listitem">
                <TagButton
                  onClick={() => removeTag(tag)}
                  onKeyDown={(e) => handleTagKeyDown(e, tag)}
                  type="button"
                  aria-label={`タグ「${tag}」を削除`}
                  title={`「${tag}」を削除`}
                >
                  <TagText>{tag}</TagText>
                  <RemoveIcon aria-hidden="true">×</RemoveIcon>
                </TagButton>
              </TagItem>
            ))}
          </TagList>
        )}
      </TagsContainer>
    </TagSection>
  )
}

const TagSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  width: 100%;
`

const SectionHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  justify-content: space-between;
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`

const TagCounter = styled.span`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`

const TagInputContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: flex-start;
  width: 100%;
`

const TagInputWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`

const ErrorMessage = styled.div`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
`

const AddTagButton = styled(Button)`
  display: flex;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing[1]};
  align-items: center;
  height: 48px; /* Match input height */
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`

const HelpText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.gray[600]};
`

const TagsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

const EmptyState = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: 0;
  margin: 0;
  list-style: none;
`

const TagItem = styled.li`
  display: inline-flex;
`

const TagButton = styled.button`
  display: inline-flex;
  gap: ${({ theme }) => theme.spacing[1]};
  align-items: center;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: background 0.2s ease;
  transition-property: background, border-color, color;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.error}10;
    border-color: ${({ theme }) => theme.colors.error};
  }
`

const TagText = styled.span`
  font-weight: inherit;
  line-height: 1;
`

const RemoveIcon = styled.span`
  margin-left: ${({ theme }) => theme.spacing[1]};
  font-size: 18px;
  font-weight: bold;
  opacity: 0.6;
  transition: opacity 0.2s ease;

  ${TagButton}:hover & {
    opacity: 1;
  }

  ${TagButton}:focus & {
    opacity: 1;
  }
`
