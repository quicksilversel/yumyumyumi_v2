import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormContext, useFieldArray } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import {
  H2,
  Caption,
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
      watchedIngredients.length > 0
        ? watchedIngredients[watchedIngredients.length - 1]?.isSpice || false
        : false
    append({
      name: '',
      amount: '',
      isSpice: previousIsSpice,
    })
  }

  const removeIngredient = (index: number) => {
    remove(index)
  }

  return (
    <Section>
      <SectionHeader>
        <H2 id="ingredients-heading">材料</H2>
        <AddButton
          variant="primary"
          size="sm"
          onClick={addIngredient}
          type="button"
          aria-describedby="ingredients-help"
        >
          <AddIcon fontSize="inherit" />
          材料を追加
        </AddButton>
      </SectionHeader>
      {errors.ingredients &&
        typeof errors.ingredients === 'object' &&
        'message' in errors.ingredients && (
          <ErrorText role="alert">{errors.ingredients.message}</ErrorText>
        )}
      {fields.length === 0 ? (
        <EmptyState>
          <Caption id="ingredients-help">
            まだ材料が追加されていません。「材料を追加」ボタンを押して追加してください。
          </Caption>
        </EmptyState>
      ) : (
        <IngredientsList
          role="list"
          aria-labelledby="ingredients-heading"
          aria-describedby="ingredients-help"
        >
          {fields.map((field, index) => (
            <IngredientItem key={field.id} role="listitem">
              <FieldGroup>
                <Input
                  {...register(`ingredients.${index}.name`, {
                    required: '材料名は必須です',
                    minLength: {
                      value: 1,
                      message: '材料名を入力してください',
                    },
                  })}
                  title="材料名"
                  value={watch(`ingredients.${index}.name`)}
                  error={!!errors.ingredients?.[index]?.name}
                  aria-describedby={
                    errors.ingredients?.[index]?.name
                      ? `ingredient-name-error-${index}`
                      : undefined
                  }
                />
                {errors.ingredients?.[index]?.name && (
                  <ErrorText id={`ingredient-name-error-${index}`} role="alert">
                    {errors.ingredients[index].name?.message}
                  </ErrorText>
                )}
              </FieldGroup>
              <FieldGroup>
                <Input
                  {...register(`ingredients.${index}.amount`, {
                    required: '分量は必須です',
                    minLength: {
                      value: 1,
                      message: '分量を入力してください',
                    },
                  })}
                  title="分量"
                  value={watch(`ingredients.${index}.amount`)}
                  error={!!errors.ingredients?.[index]?.amount}
                  aria-describedby={
                    errors.ingredients?.[index]?.amount
                      ? `ingredient-amount-error-${index}`
                      : undefined
                  }
                />
                {errors.ingredients?.[index]?.amount && (
                  <ErrorText
                    id={`ingredient-amount-error-${index}`}
                    role="alert"
                  >
                    {errors.ingredients[index].amount?.message}
                  </ErrorText>
                )}
              </FieldGroup>

              <DeleteButton
                size="sm"
                onClick={() => removeIngredient(index)}
                disabled={fields.length === 1}
                type="button"
                aria-label={`${index + 1}番目の材料を削除`}
              >
                <DeleteIcon />
              </DeleteButton>
              <SpiceToggleWrapper>
                <ToggleSwitch
                  label="調味料・スパイス"
                  {...register(`ingredients.${index}.isSpice`)}
                  height="small"
                />
              </SpiceToggleWrapper>
            </IngredientItem>
          ))}
          <HelperText id="ingredients-help">
            調味料・スパイスにチェックを入れると、レシピで区別して表示されます。
          </HelperText>
        </IngredientsList>
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

const IngredientsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: 0;
  margin: 0;
  list-style: none;
`

const IngredientItem = styled.li`
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: 2fr 1fr auto;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: start;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`

const DeleteButton = styled(IconButton)`
  grid-row: 1;
  grid-column: 3;
  align-self: start;
  margin-top: 8px; /* Align with input top */
`

const SpiceToggleWrapper = styled.div`
  grid-row: 2;
  grid-column: 1 / -1;
  margin-top: ${({ theme }) => theme.spacing[2]};
`

const HelperText = styled.p`
  margin: ${({ theme }) => theme.spacing[2]} 0 0 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
`
