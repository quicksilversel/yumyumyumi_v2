'use client'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Ingredient } from '@/types'

import { Button, IconButton } from '@/components/ui/Button'
import { Input, FormField } from '@/components/ui/Input'
import { Flex, Stack } from '@/components/ui/Layout'
import { H6, Caption } from '@/components/ui/Typography'
import { colors, spacing, borderRadius } from '@/styles/designTokens'

const IngredientRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto auto;
  gap: ${spacing[2]};
  align-items: end;
  padding: ${spacing[3]};
  background-color: ${colors.gray[50]};
  border-radius: ${borderRadius.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const SpiceToggle = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[2]} 0;
  cursor: pointer;
  font-size: 14px;
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`

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
    onChange([
      ...ingredients,
      { name: '', amount: '', unit: '', isSpice: false },
    ])
  }

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  return (
    <Stack gap={3}>
      <Flex justify="between" align="center">
        <H6>Ingredients</H6>
        <Button variant="secondary" size="sm" onClick={addIngredient}>
          <AddIcon />
          Add Ingredient
        </Button>
      </Flex>

      {ingredients.length === 0 ? (
        <Caption>
          No ingredients added yet. Click &quot;Add Ingredient&quot; to start.
        </Caption>
      ) : (
        <Stack gap={2}>
          {ingredients.map((ingredient, index) => (
            <IngredientRow key={index}>
              <FormField style={{ marginBottom: 0 }}>
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

              <FormField style={{ marginBottom: 0 }}>
                <Input
                  placeholder="Amount *"
                  value={ingredient.amount || ''}
                  onChange={(e) =>
                    handleIngredientChange(index, 'amount', e.target.value)
                  }
                  required
                  fullWidth
                />
              </FormField>

              <FormField style={{ marginBottom: 0 }}>
                <Input
                  placeholder="Unit"
                  value={ingredient.unit || ''}
                  onChange={(e) =>
                    handleIngredientChange(index, 'unit', e.target.value)
                  }
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
