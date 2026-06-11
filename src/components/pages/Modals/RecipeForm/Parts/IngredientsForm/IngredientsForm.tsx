import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormContext, useFieldArray } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import {
  H2,
  ErrorText,
  Input,
  Button,
  IconButton,
  ToggleSwitch,
} from '@/components/ui'

export function IngredientsForm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RecipeForm>()

  const { fields, append, remove } = useFieldArray({
    name: 'ingredients',
  })

  const watchedIngredients = watch('ingredients') || []

  const addIngredient = () => {
    const previousIsSpice =
      watchedIngredients[watchedIngredients.length - 1]?.isSpice || false
    append({ name: '', amount: '', isSpice: previousIsSpice })
  }

  return (
    <Section>
      <H2 id="ingredients-heading">材料</H2>

      {errors.ingredients &&
        typeof errors.ingredients === 'object' &&
        'message' in errors.ingredients && (
          <ErrorText role="alert">{errors.ingredients.message}</ErrorText>
        )}

      {fields.length === 0 ? (
        <EmptyState>
          <EmptyText>まだ材料がありません</EmptyText>
          <Button
            variant="primary"
            size="md"
            onClick={addIngredient}
            type="button"
          >
            <AddIcon fontSize="inherit" />
            材料を追加
          </Button>
        </EmptyState>
      ) : (
        <>
          <IngredientsList role="list" aria-labelledby="ingredients-heading">
            {fields.map((field, index) => (
              <IngredientItem key={field.id} role="listitem">
                <Fields>
                  <NameField>
                    <Input
                      {...register(`ingredients.${index}.name`, {
                        required: '材料名を入力してください',
                      })}
                      title="材料名"
                      placeholder="例：玉ねぎ"
                      height="medium"
                      value={watch(`ingredients.${index}.name`)}
                      error={!!errors.ingredients?.[index]?.name}
                    />
                    {errors.ingredients?.[index]?.name && (
                      <ErrorText role="alert">
                        {errors.ingredients[index].name?.message}
                      </ErrorText>
                    )}
                  </NameField>
                  <AmountField>
                    <Input
                      {...register(`ingredients.${index}.amount`, {
                        required: '分量を入力してください',
                      })}
                      title="分量"
                      placeholder="例：1個"
                      height="medium"
                      value={watch(`ingredients.${index}.amount`)}
                      error={!!errors.ingredients?.[index]?.amount}
                    />
                    {errors.ingredients?.[index]?.amount && (
                      <ErrorText role="alert">
                        {errors.ingredients[index].amount?.message}
                      </ErrorText>
                    )}
                  </AmountField>
                  <DeleteButton
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    type="button"
                    aria-label={`${index + 1}番目の材料を削除`}
                  >
                    <DeleteIcon />
                  </DeleteButton>
                </Fields>
                <ToggleSwitch
                  label="調味料・スパイス"
                  {...register(`ingredients.${index}.isSpice`)}
                  height="small"
                />
              </IngredientItem>
            ))}
          </IngredientsList>

          <AddRowButton
            variant="ghost"
            size="md"
            onClick={addIngredient}
            type="button"
          >
            <AddIcon fontSize="inherit" />
            材料を追加
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

const IngredientsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: 0;
  margin: 0;
  list-style: none;
`

const IngredientItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const Fields = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: flex-start;

  @media (width <= 28rem) {
    flex-wrap: wrap;
  }
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  min-width: 0;
`

const NameField = styled(FieldGroup)`
  flex: 2 1 140px;
`

const AmountField = styled(FieldGroup)`
  flex: 1 1 96px;
`

const DeleteButton = styled(IconButton)`
  flex-shrink: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
`

const AddRowButton = styled(Button)`
  width: 100%;
  border: 1px dashed ${({ theme }) => theme.colors.gray[300]};
`
