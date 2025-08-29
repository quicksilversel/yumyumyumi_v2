'use client'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Ingredient } from '@/types'

import { Button, IconButton } from '@/components/ui/Button'
import { Input, FormField } from '@/components/ui/Input'
import { Stack } from '@/components/ui/Layout'
import { H6, Caption } from '@/components/ui/Typography'
import { colors, spacing, borderRadius } from '@/styles/designTokens'

type IngredientsFormProps = {
  ingredients: Ingredient[]
  onChange: (ingredients: Ingredient[]) => void
}

export function IngredientsForm({
  ingredients,
  onChange,
}: IngredientsFormProps) {
  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string | boolean,
  ) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    }
    onChange(newIngredients)
  }

  const addIngredient = () => {
    onChange([...ingredients, { name: '', amount: '', isSpice: false }])
  }

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  return (
    <Stack gap={3}>
      <Title>
        <H6>Ingredients</H6>
        <Button variant="secondary" size="sm" onClick={addIngredient}>
          <AddIcon />
          Add Ingredient
        </Button>
      </Title>

      {ingredients.length === 0 ? (
        <Caption>
          No ingredients added yet. Click &quot;Add Ingredient&quot; to start.
        </Caption>
      ) : (
        <Stack gap={2}>
          {ingredients.map((ingredient, index) => (
            <IngredientRow key={index}>
              <FormField>
                <Input
                  placeholder="Ingredient name *"
                  value={ingredient.name || ''}
                  onChange={(e) =>
                    handleIngredientChange(index, 'name', e.target.value)
                  }
                  required
                  fullWidth
                />
              </FormField>

              <FormField>
                <Input
                  placeholder="Amount (e.g., 2 cups, 1 tbsp, 500g) *"
                  value={ingredient.amount || ''}
                  onChange={(e) =>
                    handleIngredientChange(index, 'amount', e.target.value)
                  }
                  required
                  fullWidth
                />
              </FormField>

              <SpiceToggle>
                <Checkbox
                  type="checkbox"
                  checked={ingredient.isSpice || false}
                  onChange={(e) =>
                    handleIngredientChange(index, 'isSpice', e.target.checked)
                  }
                />
                Spice
              </SpiceToggle>
              <IconButton
                size="sm"
                onClick={() => removeIngredient(index)}
                disabled={ingredients.length === 1}
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
  align-items: center;
  grid-template-columns: 2fr 2fr auto auto;
  gap: ${spacing[2]};
  padding: ${spacing[3]};
  border-radius: ${borderRadius.md};
  background-color: ${colors.gray[50]};

  @media (width <= 768px) {
    grid-template-columns: 1fr;
  }
`

const SpiceToggle = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[2]} 0;
  font-size: 14px;
  cursor: pointer;
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`
