import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormContext, useFieldArray } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import {
  H2,
  ErrorText,
  Input,
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

  const addDirection = () => append({ title: '', description: '' })

  return (
    <Section>
      <H2 id="directions-heading">作り方</H2>

      {errors.directions &&
        typeof errors.directions === 'object' &&
        'message' in errors.directions && (
          <ErrorText role="alert">{errors.directions.message}</ErrorText>
        )}

      {fields.length === 0 ? (
        <EmptyState>
          <EmptyText>まだ手順がありません</EmptyText>
          <Button
            variant="primary"
            size="md"
            onClick={addDirection}
            type="button"
          >
            <AddIcon fontSize="inherit" />
            手順を追加
          </Button>
        </EmptyState>
      ) : (
        <>
          <DirectionsList role="list" aria-labelledby="directions-heading">
            {fields.map((field, index) => (
              <DirectionItem key={field.id} role="listitem">
                <StepNumber aria-label={`手順 ${index + 1}`}>
                  {index + 1}
                </StepNumber>
                <DirectionContent>
                  <FieldGroup>
                    <Input
                      {...register(`directions.${index}.title`, {
                        required: '見出しは必須です',
                      })}
                      title="見出し（必須）"
                      placeholder="例：野菜を切る"
                      height="medium"
                      value={watch(`directions.${index}.title`)}
                      error={!!errors.directions?.[index]?.title}
                    />
                    {errors.directions?.[index]?.title && (
                      <ErrorText role="alert">
                        {errors.directions[index].title?.message}
                      </ErrorText>
                    )}
                  </FieldGroup>
                  <Textarea
                    {...register(`directions.${index}.description`)}
                    title="詳細（任意）"
                    placeholder="例：玉ねぎはみじん切りにする"
                    value={watch(`directions.${index}.description`)}
                    error={!!errors.directions?.[index]?.description}
                    minRows={3}
                  />
                </DirectionContent>
                {fields.length > 1 && (
                  <DeleteButton
                    size="sm"
                    onClick={() => remove(index)}
                    type="button"
                    aria-label={`手順 ${index + 1} を削除`}
                  >
                    <DeleteIcon />
                  </DeleteButton>
                )}
              </DirectionItem>
            ))}
          </DirectionsList>

          <AddRowButton
            variant="ghost"
            size="md"
            onClick={addDirection}
            type="button"
          >
            <AddIcon fontSize="inherit" />
            手順を追加
          </AddRowButton>
        </>
      )}
    </Section>
  )
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border: 1px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const EmptyText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`

const DirectionsList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: 0;
  margin: 0;
  list-style: none;
`

const DirectionItem = styled.li`
  position: relative;
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const StepNumber = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
`

const DirectionContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  min-width: 0;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`

const DeleteButton = styled(IconButton)`
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: ${({ theme }) => theme.spacing[1]};
`

const AddRowButton = styled(Button)`
  width: 100%;
  border: 1px dashed ${({ theme }) => theme.colors.gray[300]};
`
