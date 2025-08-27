'use client'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Direction } from '@/types'

import { Button, IconButton } from '@/components/ui/Button'
import { Input, TextArea, FormField } from '@/components/ui/Input'
import { Flex, Stack } from '@/components/ui/Layout'
import { H6, Caption } from '@/components/ui/Typography'
import {
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/styles/designTokens'

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
      <Flex justify="between" align="center">
        <H6>Directions</H6>
        <Button variant="secondary" size="sm" onClick={addDirection}>
          <AddIcon />
          Add Step
        </Button>
      </Flex>

      {directions.length === 0 ? (
        <Caption>
          No directions added yet. Click &quot;Add Step&quot; to start.
        </Caption>
      ) : (
        <Stack gap={3}>
          {directions.map((direction, index) => (
            <DirectionRow key={index}>
              <StepNumber>{index + 1}</StepNumber>

              <DirectionContent gap={2}>
                <FormField style={{ marginBottom: 0 }}>
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

                <FormField style={{ marginBottom: 0 }}>
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

const DirectionRow = styled.div`
  position: relative;
  padding: ${spacing[4]};
  padding-left: ${spacing[12]};
  background-color: ${colors.white};
  border: 1px solid ${colors.gray[200]};
  border-radius: ${borderRadius.lg};
`

const StepNumber = styled.div`
  position: absolute;
  left: ${spacing[4]};
  top: ${spacing[4]};
  width: 32px;
  height: 32px;
  background-color: ${colors.black};
  color: ${colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.sm};
`

const DirectionContent = styled(Stack)`
  flex: 1;
`

const DeleteButton = styled(IconButton)`
  position: absolute;
  top: ${spacing[3]};
  right: ${spacing[3]};
`
