'use client'

import styled from '@emotion/styled'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Ingredient } from '@/types'

import { Button, IconButton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Forms/Input'
import { Stack } from '@/components/ui/Layout'
import { H6, Caption } from '@/components/ui/Typography'
import { useRecipeForm } from '@/contexts/RecipeFormContext'
import { colors, spacing, borderRadius } from '@/styles/designTokens'

type Props = {
  mode: 'new' | 'edit'
}

export function validateIngredients(ingredients: Ingredient[]): {
  isValid: boolean
  error?: string
  validIngredients?: Ingredient[]
} {
  if (!ingredients || ingredients.length === 0) {
    return {
      isValid: false,
      error: 'At least one ingredient is required',
    }
  }

  const validIngredients = ingredients
    .filter((ing) => ing.name?.trim() && ing.amount?.trim())
    .map((ing) => ({
      name: String(ing.name).trim(),
      amount: String(ing.amount).trim(),
      isSpice: Boolean(ing.isSpice),
    }))

  if (validIngredients.length === 0) {
    return {
      isValid: false,
      error: 'Please add at least one ingredient with name and amount',
    }
  }

  return {
    isValid: true,
    validIngredients,
  }
}

export function IngredientsForm({ mode }: Props) {
  const { recipe, setRecipe } = useRecipeForm(mode)
  const ingredients = recipe.ingredients || []
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
    setRecipe((prev) => ({ ...prev, ingredients: newIngredients }))
  }

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [
        ...(prev.ingredients || []),
        { name: '', amount: '', isSpice: false },
      ],
    }))
  }

  const removeIngredient = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((_, i) => i !== index),
    }))
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
              <Input
                placeholder="Ingredient name *"
                value={ingredient.name || ''}
                onChange={(e) =>
                  handleIngredientChange(index, 'name', e.target.value)
                }
                required
              />

              <Input
                placeholder="Amount (e.g., 2 cups, 1 tbsp, 500g) *"
                value={ingredient.amount || ''}
                onChange={(e) =>
                  handleIngredientChange(index, 'amount', e.target.value)
                }
                required
              />

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
