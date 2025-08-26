'use client'

import styled from '@emotion/styled'

import {
  Input,
  TextArea,
  Select,
  FormField,
  FormLabel,
} from '@/components/ui/Input'
import { Grid } from '@/components/ui/Layout'
import { Caption } from '@/components/ui/Typography'
import { colors, spacing } from '@/styles/designTokens'
import { RecipeCategory } from '@/types'

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  cursor: pointer;
  user-select: none;
`

const Switch = styled.input`
  width: 40px;
  height: 20px;
  appearance: none;
  background-color: ${colors.gray[300]};
  border-radius: 10px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:checked {
    background-color: ${colors.black};
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background-color: ${colors.white};
    border-radius: 50%;
    transition: transform 0.2s;
  }

  &:checked::after {
    transform: translateX(20px);
  }
`

type BasicInfoFieldsProps = {
  title: string
  setTitle: (value: string) => void
  summary: string
  setSummary: (value: string) => void
  category: string
  setCategory: (value: string) => void
  source?: string
  setSource?: (value: string) => void
}

export function BasicInfoFields({
  title,
  setTitle,
  summary,
  setSummary,
  category,
  setCategory,
  source,
  setSource,
}: BasicInfoFieldsProps) {
  const categories = Object.values(RecipeCategory)

  return (
    <>
      <FormField>
        <FormLabel htmlFor="title">Recipe Title *</FormLabel>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter recipe title"
          required
          fullWidth
        />
      </FormField>

      <FormField>
        <FormLabel htmlFor="summary">Summary *</FormLabel>
        <TextArea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief description of the recipe"
          required
          fullWidth
          rows={3}
        />
      </FormField>

      <Grid cols={2} gap={4}>
        <FormField>
          <FormLabel htmlFor="category">Category *</FormLabel>
          <Select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </FormField>

        {setSource && (
          <FormField>
            <FormLabel htmlFor="source">Source</FormLabel>
            <Input
              id="source"
              value={source || ''}
              onChange={(e) => setSource?.(e.target.value)}
              placeholder="Recipe source (optional)"
              fullWidth
            />
          </FormField>
        )}
      </Grid>
    </>
  )
}

type TimeAndServingsFieldsProps = {
  prepTime: number
  setPrepTime: (value: number) => void
  cookTime: number
  setCookTime: (value: number) => void
  servings: number
  setServings: (value: number) => void
}

export function TimeAndServingsFields({
  prepTime,
  setPrepTime,
  cookTime,
  setCookTime,
  servings,
  setServings,
}: TimeAndServingsFieldsProps) {
  return (
    <Grid cols={3} gap={4}>
      <FormField>
        <FormLabel htmlFor="prepTime">Prep Time (min) *</FormLabel>
        <Input
          id="prepTime"
          type="number"
          value={prepTime}
          onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
          min="0"
          required
          fullWidth
        />
      </FormField>

      <FormField>
        <FormLabel htmlFor="cookTime">Cook Time (min) *</FormLabel>
        <Input
          id="cookTime"
          type="number"
          value={cookTime}
          onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
          min="0"
          required
          fullWidth
        />
      </FormField>

      <FormField>
        <FormLabel htmlFor="servings">Servings *</FormLabel>
        <Input
          id="servings"
          type="number"
          value={servings}
          onChange={(e) => setServings(parseInt(e.target.value) || 1)}
          min="1"
          required
          fullWidth
        />
      </FormField>
    </Grid>
  )
}

type AdditionalFieldsProps = {
  tips: string
  setTips: (value: string) => void
  isPublic: boolean
  setIsPublic: (value: boolean) => void
}

export function AdditionalFields({
  tips,
  setTips,
  isPublic,
  setIsPublic,
}: AdditionalFieldsProps) {
  return (
    <>
      <FormField>
        <FormLabel htmlFor="tips">Tips & Notes</FormLabel>
        <TextArea
          id="tips"
          value={tips}
          onChange={(e) => setTips(e.target.value)}
          placeholder="Any cooking tips or notes (optional)"
          fullWidth
          rows={3}
        />
      </FormField>

      <FormField>
        <ToggleSwitch>
          <Switch
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span>Make this recipe public</span>
        </ToggleSwitch>
        <Caption>Public recipes can be viewed by anyone</Caption>
      </FormField>
    </>
  )
}
