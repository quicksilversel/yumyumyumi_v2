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
    formState: { errors },
  } = useFormContext<RecipeForm>()

  const { fields, append, remove } = useFieldArray({
    name: 'ingredients',
  })

  const addIngredient = () => {
    append({ name: '', amount: '', isSpice: false })
  }

  const removeIngredient = (index: number) => {
    remove(index)
  }

  return (
    <Stack gap={3}>
      <Title>
        <H2>Ingredients</H2>
      </Title>
      {errors.ingredients &&
        typeof errors.ingredients === 'object' &&
        'message' in errors.ingredients && (
          <ErrorText>{errors.ingredients.message}</ErrorText>
        )}
      {fields.length === 0 ? (
        <Caption>
          No ingredients added yet. Click &quot;Add&quot; to start.
        </Caption>
      ) : (
        <Stack gap={2}>
          {fields.map((field, index) => (
            <IngredientRow key={field.id}>
              <FieldContainer>
                <Input
                  {...register(`ingredients.${index}.name`, {
                    required: 'Ingredient name is required',
                    minLength: {
                      value: 1,
                      message: 'Name cannot be empty',
                    },
                  })}
                  placeholder="材料名"
                  error={!!errors.ingredients?.[index]?.name}
                />
                {errors.ingredients?.[index]?.name && (
                  <ErrorText>
                    {errors.ingredients[index].name?.message}
                  </ErrorText>
                )}
                <Input
                  {...register(`ingredients.${index}.amount`, {
                    required: 'Amount is required',
                    minLength: {
                      value: 1,
                      message: 'Amount cannot be empty',
                    },
                  })}
                  placeholder="量"
                  error={!!errors.ingredients?.[index]?.amount}
                />
                {errors.ingredients?.[index]?.amount && (
                  <ErrorText>
                    {errors.ingredients[index].amount?.message}
                  </ErrorText>
                )}
                <IconButton
                  size="sm"
                  onClick={() => removeIngredient(index)}
                  disabled={fields.length === 1}
                  type="button"
                >
                  <DeleteIcon />
                </IconButton>
              </FieldContainer>
              <StyledToggleSwitch
                label="Spice"
                {...register(`ingredients.${index}.isSpice`)}
                height="small"
              />
            </IngredientRow>
          ))}
        </Stack>
      )}
      <Button variant="primary" size="sm" onClick={addIngredient} type="button">
        <AddIcon fontSize="inherit" />
        Add Ingredients
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

const IngredientRow = styled.div`
  width: 100%;
`

const FieldContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 4fr 2fr 1fr;
  gap: 4px;
`

const StyledToggleSwitch = styled(ToggleSwitch)`
  margin-top: ${({ theme }) => theme.spacing[2]};
`
