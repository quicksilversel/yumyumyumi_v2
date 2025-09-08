import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormContext, useFieldArray } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import {
  H2,
  Caption,
  ErrorText,
  Stack,
  Textarea,
  Button,
  IconButton,
} from '@/components/ui'

export function DirectionsForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeForm>()

  const { fields, append, remove } = useFieldArray({
    name: 'directions',
  })

  const addDirection = () => {
    append({ title: '', description: '' })
  }

  const removeDirection = (index: number) => {
    remove(index)
  }

  return (
    <Stack gap={3}>
      <Title>
        <H2>Directions</H2>
      </Title>
      {errors.directions &&
        typeof errors.directions === 'object' &&
        'message' in errors.directions && (
          <ErrorText>{errors.directions.message}</ErrorText>
        )}
      {fields.length === 0 ? (
        <Caption>
          No directions added yet. Click &quot;Add Step&quot; to start.
        </Caption>
      ) : (
        <Stack gap={3}>
          {fields.map((field, index) => (
            <DirectionRow key={field.id}>
              <StepNumber>{index + 1}</StepNumber>
              <DirectionContent>
                <FieldContainer>
                  <div>
                    <Textarea
                      {...register(`directions.${index}.title`, {
                        required: 'Direction Title is required',
                      })}
                      placeholder="手順のタイトル（例：食材を切る）"
                      rows={3}
                    />
                    {errors.directions?.[index]?.title && (
                      <ErrorText>
                        {errors.directions[index].title?.message}
                      </ErrorText>
                    )}
                  </div>
                  <Textarea
                    {...register(`directions.${index}.description`)}
                    placeholder="手順の詳細（例：ナス、ピーマン、ジャガイモは乱切りにする。）"
                    error={!!errors.directions?.[index]?.description}
                    rows={2}
                  />
                </FieldContainer>
                {fields.length > 1 && (
                  <IconButton
                    size="sm"
                    onClick={() => removeDirection(index)}
                    type="button"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </DirectionContent>
            </DirectionRow>
          ))}
        </Stack>
      )}
      <Button variant="primary" size="sm" onClick={addDirection} type="button">
        <AddIcon fontSize="inherit" />
        Add Step
      </Button>
    </Stack>
  )
}

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const DirectionRow = styled.div`
  width: 100%;
`

const DirectionContent = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`

const StepNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 14px;
  flex-shrink: 0;
`

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  min-width: 0;
  flex-grow: 1;
`
