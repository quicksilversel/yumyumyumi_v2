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
    watch,
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
      <H2>作り方</H2>
      {errors.directions &&
        typeof errors.directions === 'object' &&
        'message' in errors.directions && (
          <ErrorText>{errors.directions.message}</ErrorText>
        )}
      {fields.length === 0 ? (
        <Caption>
          まだ手順が追加されていません。「手順を追加」ボタンを押して追加してください。
        </Caption>
      ) : (
        <Stack gap={3}>
          {fields.map((field, index) => (
            <DirectionRow key={field.id}>
              <StepNumber>{index + 1}</StepNumber>
              <FieldContainer>
                <Textarea
                  {...register(`directions.${index}.title`, {
                    required: '見出しは必須です',
                  })}
                  title="見出し"
                  value={watch(`directions.${index}.title`)}
                  rows={3}
                />
                {errors.directions?.[index]?.title && (
                  <ErrorText>
                    {errors.directions[index].title?.message}
                  </ErrorText>
                )}
                <Textarea
                  {...register(`directions.${index}.description`)}
                  title="詳細"
                  value={watch(`directions.${index}.description`)}
                  error={!!errors.directions?.[index]?.description}
                  rows={2}
                />
              </FieldContainer>
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
      <StyledButton size="sm" onClick={addDirection} type="button">
        <AddIcon fontSize="inherit" />
        手順を追加する
      </StyledButton>
    </Stack>
  )
}

const DirectionRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[2]};
`

const StepNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  flex-shrink: 0;
`

const FieldContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`

const DeleteButton = styled(IconButton)`
  flex-shrink: 0;
`

const StyledButton = styled(Button)`
  margin-left: auto;
`
