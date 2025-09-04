import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Input, ErrorText } from '@/components/ui'

export const CookTimeForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeForm>()

  return (
    <div>
      <Input
        {...register('cookTime', {
          required: 'Cook time is required',
          min: {
            value: 1,
            message: 'Cook time must be at least 1 minute',
          },
          valueAsNumber: true,
          validate: (value) => {
            if (isNaN(value)) {
              return 'Cook time must be a valid number'
            }
            if (value <= 0) {
              return 'Cook time must be greater than 0'
            }
            return true
          },
        })}
        id="cookTime"
        title="Cook Time (minutes)"
        type="number"
        placeholder="Enter cook time in minutes"
        min={1}
        error={!!errors.cookTime}
      />
      {errors.cookTime && <ErrorText>{errors.cookTime.message}</ErrorText>}
    </div>
  )
}
