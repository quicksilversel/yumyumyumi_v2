import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { ToggleSwitch } from '@/components/ui'

export function IsPublicForm() {
  const { register } = useFormContext<RecipeForm>()

  return (
    <ToggleSwitch
      label="レシピを公開する"
      {...register('isPublic')}
      helperText="公開されたレシピは誰でも閲覧できます"
      height="small"
    />
  )
}
