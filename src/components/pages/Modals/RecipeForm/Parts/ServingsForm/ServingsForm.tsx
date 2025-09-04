import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Input, ErrorText } from '@/components/ui'

export const ServingsForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeForm>()

  return (
    <div>
      <Input
        {...register('servings', {
          required: 'Number of servings is required',
          min: {
            value: 1,
            message: 'Servings must be at least 1',
          },
          max: {
            value: 100,
            message: 'Servings cannot exceed 100',
          },
          valueAsNumber: true,
          validate: (value) => {
            if (isNaN(value)) {
              return 'Servings must be a valid number'
            }
            if (value <= 0) {
              return 'Servings must be greater than 0'
            }
            return true
          },
        })}
        id="servings"
        title="Servings"
        type="number"
        placeholder="Number of servings"
        min={1}
        max={100}
        step={1}
        error={!!errors.servings}
      />
      {errors.servings && <ErrorText>{errors.servings.message}</ErrorText>}
    </div>
  )
}
