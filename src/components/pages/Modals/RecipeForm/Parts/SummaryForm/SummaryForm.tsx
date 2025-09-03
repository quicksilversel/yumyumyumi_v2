import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types'

import { Input } from '@/components/ui/Forms/Input'

export const SummaryForm = () => {
  const { register } = useFormContext<RecipeForm>()

  return (
    <Input
      {...register('summary')}
      id="summary"
      title="Summary"
      placeholder="Brief description of the recipe"
    />
  )
}
