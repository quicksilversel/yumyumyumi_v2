import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormContext, useFieldArray } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import {
  H2,
  Caption,
  Stack,
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
    <Stack gap={3}>
      <H2>材料</H2>
      {errors.ingredients &&
        typeof errors.ingredients === 'object' &&
        'message' in errors.ingredients && (
          <ErrorText>{errors.ingredients.message}</ErrorText>
        )}
      {fields.length === 0 ? (
        <Caption>
          まだ材料が追加されていません。「材料を追加」ボタンを押して追加してください。
        </Caption>
      ) : (
        <Stack gap={2}>
          {fields.map((field, index) => (
            <IngredientRow key={field.id}>
              <IngredientInput
                {...register(`ingredients.${index}.name`, {
                  required: 'Ingredient name is required',
                  minLength: {
                    value: 1,
                    message: 'Name cannot be empty',
                  },
                })}
                title="材料"
                value={watch(`ingredients.${index}.name`)}
                error={!!errors.ingredients?.[index]?.name}
              />
              {errors.ingredients?.[index]?.name && (
                <ErrorText>{errors.ingredients[index].name?.message}</ErrorText>
              )}
              <AmountInput
                {...register(`ingredients.${index}.amount`, {
                  required: 'Amount is required',
                  minLength: {
                    value: 1,
                    message: 'Amount cannot be empty',
                  },
                })}
                title="分量"
                value={watch(`ingredients.${index}.amount`)}
                error={!!errors.ingredients?.[index]?.amount}
              />
              {errors.ingredients?.[index]?.amount && (
                <ErrorText>
                  {errors.ingredients[index].amount?.message}
                </ErrorText>
              )}
              <DeleteButton
                size="sm"
                onClick={() => removeIngredient(index)}
                disabled={fields.length === 1}
                type="button"
              >
                <DeleteIcon />
              </DeleteButton>
              <SpiceToggle
                label="A"
                {...register(`ingredients.${index}.isSpice`)}
                height="small"
              />
            </IngredientRow>
          ))}
        </Stack>
      )}
      <StyledButton size="sm" onClick={addIngredient} type="button">
        <AddIcon fontSize="inherit" />
        材料を追加する
      </StyledButton>
    </Stack>
  )
}

const IngredientRow = styled.div`
  display: grid;
  align-items: start;
  grid-template-columns: 4fr 2fr auto;
  grid-template-rows: auto auto auto;
  gap: 0 ${({ theme }) => theme.spacing[2]};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[2]};
`

const IngredientInput = styled(Input)`
  grid-column: 1;
  grid-row: 1;
`

const AmountInput = styled(Input)`
  grid-column: 2;
  grid-row: 1;
`

const DeleteButton = styled(IconButton)`
  grid-column: 3;
  grid-row: 1;
  align-self: center;
`

const SpiceToggle = styled(ToggleSwitch)`
  margin-top: ${({ theme }) => theme.spacing[2]};
  grid-column: 1 / -1;
  grid-row: 3;
`

const StyledButton = styled(Button)`
  margin-left: auto;
`
