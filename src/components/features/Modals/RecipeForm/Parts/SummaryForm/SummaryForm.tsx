import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Textarea } from '@/components/ui'

export const SummaryForm = () => {
  const { register, watch } = useFormContext<RecipeForm>()

  return (
    <Textarea
      {...register('summary')}
      id="summary"
      value={watch('summary')}
      title="概要"
      placeholder="レシピの概要を入力してください"
      rows={1}
    />
  )
}
