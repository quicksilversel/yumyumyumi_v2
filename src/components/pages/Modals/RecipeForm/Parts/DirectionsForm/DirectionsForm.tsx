import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormContext, useFieldArray } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import {
  H2,
  Caption,
  ErrorText,
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
    <Section>
      <SectionHeader>
        <H2 id="directions-heading">作り方</H2>
        <AddButton
          variant="primary"
          size="sm"
          onClick={addDirection}
          type="button"
          aria-describedby="directions-help"
        >
          <AddIcon fontSize="inherit" />
          手順を追加
        </AddButton>
      </SectionHeader>

      {errors.directions &&
        typeof errors.directions === 'object' &&
        'message' in errors.directions && (
          <ErrorText role="alert">{errors.directions.message}</ErrorText>
        )}
      {fields.length === 0 ? (
        <EmptyState>
          <Caption id="directions-help">
            まだ手順が追加されていません。「手順を追加」ボタンを押して追加してください。
          </Caption>
        </EmptyState>
      ) : (
        <DirectionsList
          role="list"
          aria-labelledby="directions-heading"
          aria-describedby="directions-help"
        >
          {fields.map((field, index) => (
            <DirectionItem key={field.id} role="listitem">
              <StepNumber aria-label={`手順 ${index + 1}`}>
                {index + 1}
              </StepNumber>
              <DirectionContent>
                <FieldGroup>
                  <Textarea
                    {...register(`directions.${index}.title`, {
                      required: '見出しは必須です',
                    })}
                    title="見出し"
                    value={watch(`directions.${index}.title`)}
                    rows={2}
                    aria-describedby={
                      errors.directions?.[index]?.title
                        ? `direction-title-error-${index}`
                        : undefined
                    }
                  />
                  {errors.directions?.[index]?.title && (
                    <ErrorText
                      id={`direction-title-error-${index}`}
                      role="alert"
                    >
                      {errors.directions[index].title?.message}
                    </ErrorText>
                  )}
                </FieldGroup>
                <FieldGroup>
                  <Textarea
                    {...register(`directions.${index}.description`)}
                    title="詳細"
                    value={watch(`directions.${index}.description`)}
                    error={!!errors.directions?.[index]?.description}
                    rows={3}
                    aria-describedby={
                      errors.directions?.[index]?.description
                        ? `direction-desc-error-${index}`
                        : undefined
                    }
                  />
                  {errors.directions?.[index]?.description && (
                    <ErrorText
                      id={`direction-desc-error-${index}`}
                      role="alert"
                    >
                      {errors.directions[index].description?.message}
                    </ErrorText>
                  )}
                </FieldGroup>
              </DirectionContent>
              {fields.length > 1 && (
                <DeleteButton
                  size="sm"
                  onClick={() => removeDirection(index)}
                  type="button"
                  aria-label={`手順 ${index + 1} を削除`}
                >
                  <DeleteIcon />
                </DeleteButton>
              )}
            </DirectionItem>
          ))}
          <HelperText id="directions-help">
            各手順には見出しと詳細を入力してください。見出しは必須です。
          </HelperText>
        </DirectionsList>
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

const SectionHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  justify-content: space-between;
`

const AddButton = styled(Button)`
  flex-shrink: 0;
`

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border: 1px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const DirectionsList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: 0;
  margin: 0;
  list-style: none;
  counter-reset: step-counter;
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
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`

const DeleteButton = styled(IconButton)`
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 8px;
`

const HelperText = styled.p`
  margin: ${({ theme }) => theme.spacing[2]} 0 0 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
`
