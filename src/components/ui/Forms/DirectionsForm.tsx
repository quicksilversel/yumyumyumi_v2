import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Direction } from '@/types'

import { Button, IconButton } from '@/components/ui/Button'
import { Input, TextArea, FormField } from '@/components/ui/Input'
import { Stack } from '@/components/ui/Layout'
import { H6, Caption } from '@/components/ui/Typography'

type DirectionsFormProps = {
  directions: Direction[]
  onChange: (directions: Direction[]) => void
}

export function DirectionsForm({ directions, onChange }: DirectionsFormProps) {
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
    onChange(newDirections)
  }

  const addDirection = () => {
    onChange([...directions, { title: '', description: '' }])
  }

  const removeDirection = (index: number) => {
    onChange(directions.filter((_, i) => i !== index))
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
                <FormField>
                  <Input
                    placeholder="Step title (e.g., 'Prepare ingredients')"
                    value={direction.title || ''}
                    onChange={(e) =>
                      handleDirectionChange(index, 'title', e.target.value)
                    }
                    fullWidth
                    id={`direction-title-${index}`}
                  />
                </FormField>

                <FormField>
                  <TextArea
                    placeholder="Step description (optional)"
                    value={direction.description || ''}
                    onChange={(e) =>
                      handleDirectionChange(
                        index,
                        'description',
                        e.target.value,
                      )
                    }
                    fullWidth
                    rows={3}
                  />
                </FormField>
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
