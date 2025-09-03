import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormContext, useFieldArray, Controller } from 'react-hook-form'

import type { RecipeForm } from '@/types'

import {
  H6,
  Caption,
  Stack,
  ErrorText,
  Input,
  Button,
  IconButton,
} from '@/components/ui'

export function IngredientsForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<RecipeForm>()

  const { fields, append, remove } = useFieldArray({
    control,
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
        <H6>Ingredients</H6>
        <Button
          variant="secondary"
          size="sm"
          onClick={addIngredient}
          type="button"
        >
          <AddIcon />
          Add Ingredient
        </Button>
      </Title>

      {errors.ingredients &&
        typeof errors.ingredients === 'object' &&
        'message' in errors.ingredients && (
          <ErrorText>{errors.ingredients.message}</ErrorText>
        )}

      {fields.length === 0 ? (
        <Caption>
          No ingredients added yet. Click &quot;Add Ingredient&quot; to start.
        </Caption>
      ) : (
        <Stack gap={2}>
          {fields.map((field, index) => (
            <IngredientRow key={field.id}>
              <FieldContainer>
                <Controller
                  name={`ingredients.${index}.name`}
                  control={control}
                  rules={{
                    required: 'Ingredient name is required',
                    minLength: {
                      value: 1,
                      message: 'Name cannot be empty',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Ingredient name *"
                      error={!!errors.ingredients?.[index]?.name}
                    />
                  )}
                />
                {errors.ingredients?.[index]?.name && (
                  <ErrorText>
                    {errors.ingredients[index].name?.message}
                  </ErrorText>
                )}
              </FieldContainer>

              <FieldContainer>
                <Controller
                  name={`ingredients.${index}.amount`}
                  control={control}
                  rules={{
                    required: 'Amount is required',
                    minLength: {
                      value: 1,
                      message: 'Amount cannot be empty',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Amount (e.g., 2 cups) *"
                      error={!!errors.ingredients?.[index]?.amount}
                    />
                  )}
                />
                {errors.ingredients?.[index]?.amount && (
                  <ErrorText>
                    {errors.ingredients[index].amount?.message}
                  </ErrorText>
                )}
              </FieldContainer>

              <Controller
                name={`ingredients.${index}.isSpice`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <SpiceToggle>
                    <Checkbox
                      type="checkbox"
                      checked={value || false}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                    Spice
                  </SpiceToggle>
                )}
              />

              <IconButton
                size="sm"
                onClick={() => removeIngredient(index)}
                disabled={fields.length === 1}
                type="button"
              >
                <DeleteIcon />
              </IconButton>
            </IngredientRow>
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

const IngredientRow = styled.div`
  width: 100%;
  display: grid;
  align-items: start;
  grid-template-columns: 2fr 2fr auto auto;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.gray[50]};

  @media (width <= 768px) {
    grid-template-columns: 1fr;
  }
`

const SpiceToggle = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} 0;
  font-size: 14px;
  cursor: pointer;
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
