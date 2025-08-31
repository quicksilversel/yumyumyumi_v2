import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Direction } from '@/types'

import { Button, IconButton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Forms/Input'
import { Textarea } from '@/components/ui/Forms/Textarea'
import { Stack } from '@/components/ui/Layout'
import { H6, Caption } from '@/components/ui/Typography'
import { useRecipeForm } from '@/contexts/RecipeFormContext'

type Props = {
  mode: 'new' | 'edit'
}

export function validateDirections(directions: Direction[]): {
  isValid: boolean
  error?: string
  validDirections?: Direction[]
} {
  if (!directions || directions.length === 0) {
    return {
      isValid: false,
      error: 'At least one direction is required',
    }
  }

  const validDirections = directions
    .filter((dir) => dir.title?.trim() || dir.description?.trim())
    .map((dir) => ({
      title: String(dir.title || '').trim(),
      description: String(dir.description || '').trim(),
    }))

  if (validDirections.length === 0) {
    return {
      isValid: false,
      error: 'Please add at least one direction with title or description',
    }
  }

  return {
    isValid: true,
    validDirections,
  }
}

export function DirectionsForm({ mode }: Props) {
  const { recipe, setRecipe } = useRecipeForm(mode)
  const directions = recipe.directions || []
  const handleDirectionChange = (
    index: number,
    field: keyof Direction,
    value: string,
  ) => {
    const newDirections = [...directions]
    newDirections[index] = {
      ...newDirections[index],
      [field]: value,
    }
    setRecipe((prev) => ({ ...prev, directions: newDirections }))
  }

  const addDirection = () => {
    setRecipe((prev) => ({
      ...prev,
      directions: [...(prev.directions || []), { title: '', description: '' }],
    }))
  }

  const removeDirection = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      directions: (prev.directions || []).filter((_, i) => i !== index),
    }))
  }

  return (
    <Stack gap={3}>
      <Title>
        <H6>Directions</H6>
        <Button variant="secondary" size="sm" onClick={addDirection}>
          <AddIcon />
          Add Step
        </Button>
      </Title>

      {directions.length === 0 ? (
        <Caption>
          No directions added yet. Click &quot;Add Step&quot; to start.
        </Caption>
      ) : (
        <Stack gap={3}>
          {directions.map((direction, index) => (
            <DirectionRow key={index}>
              <DirectionContent>
                <Input
                  placeholder="Step title (e.g., 'Prepare ingredients')"
                  value={direction.title || ''}
                  onChange={(e) =>
                    handleDirectionChange(index, 'title', e.target.value)
                  }
                  id={`direction-title-${index}`}
                />

                <Textarea
                  placeholder="Step description (optional)"
                  value={direction.description || ''}
                  onChange={(e) =>
                    handleDirectionChange(index, 'description', e.target.value)
                  }
                />
              </DirectionContent>
              {directions.length > 1 && (
                <DeleteButton size="sm" onClick={() => removeDirection(index)}>
                  <DeleteIcon />
                </DeleteButton>
              )}
            </DirectionRow>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const DirectionRow = styled.ol`
  position: relative;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[6]};
  counter-reset: list-item;
`

const DirectionContent = styled.li`
  flex: 1;
  &::before {
    position: absolute;
    top: 30px;
    left: -5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    content: counter(list-item);
  }
`

const DeleteButton = styled(IconButton)`
  position: absolute;
  top: 25px;
  right: -10px;
`
