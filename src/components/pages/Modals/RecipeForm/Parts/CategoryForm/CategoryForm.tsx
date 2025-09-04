import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { ErrorText, Select } from '@/components/ui'
import { RECIPE_CATEGORY } from '@/utils/constants'

export const CategoryForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeForm>()

  const categories = Object.values(RECIPE_CATEGORY)
  const options = categories.map((category) => ({
    value: category,
    label: category,
  }))

  return (
    <div>
      <Select
        {...register('category', {
          required: 'Category is required',
        })}
        id="category"
        title="Category"
        placeholder="Select a category"
        options={options}
        fullWidth
        error={!!errors.category}
      />
      {errors.category && <ErrorText>{errors.category.message}</ErrorText>}
    </div>
  )
}
