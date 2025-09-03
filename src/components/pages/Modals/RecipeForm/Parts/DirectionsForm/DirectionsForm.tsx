'use client'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormContext, useFieldArray, Controller } from 'react-hook-form'

import type { RecipeForm } from '@/types'

import {
  H6,
  Caption,
  ErrorText,
  Stack,
  Textarea,
  Input,
  Button,
  IconButton,
} from '@/components/ui'

export function DirectionsForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<RecipeForm>()

  const { fields, append, remove } = useFieldArray({
    control,
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
        <H6>Directions</H6>
        <Button
          variant="secondary"
          size="sm"
          onClick={addDirection}
          type="button"
        >
          <AddIcon />
          Add Step
        </Button>
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
                  <Controller
                    name={`directions.${index}.title`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Step title (e.g., 'Prepare ingredients')"
                      />
                    )}
                  />
                </FieldContainer>

                <FieldContainer>
                  <Controller
                    name={`directions.${index}.description`}
                    control={control}
                    rules={{
                      validate: (value, formValues) => {
                        const title = formValues.directions?.[index]?.title
                        if (!value && !title) {
                          return 'Either title or description is required'
                        }
                        return true
                      },
                    }}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Step description"
                        rows={3}
                        error={!!errors.directions?.[index]?.description}
                      />
                    )}
                  />
                  {errors.directions?.[index]?.description && (
                    <ErrorText>
                      {errors.directions[index].description?.message}
                    </ErrorText>
                  )}
                </FieldContainer>
              </DirectionContent>

              {fields.length > 1 && (
                <DeleteButton
                  size="sm"
                  onClick={() => removeDirection(index)}
                  type="button"
                >
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

const DirectionRow = styled.div`
  position: relative;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.gray[50]};
`

const DirectionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: ${({ theme }) => theme.spacing[6]};
  gap: ${({ theme }) => theme.spacing[2]};
`

const DeleteButton = styled(IconButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[2]};
  right: ${({ theme }) => theme.spacing[2]};
`

const StepNumber = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  left: ${({ theme }) => theme.spacing[3]};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
`

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
