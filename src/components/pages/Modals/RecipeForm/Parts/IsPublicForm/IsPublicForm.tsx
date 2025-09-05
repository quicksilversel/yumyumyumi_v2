import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { ToggleSwitch } from '@/components/ui'

export function IsPublicForm() {
  const { register } = useFormContext<RecipeForm>()

  return (
    <ToggleSwitch
      label="Make this recipe public"
      {...register('isPublic')}
      helperText="Public recipes can be viewed by anyone"
      height="small"
    />
  )
}
