import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Textarea } from '@/components/ui/Forms/Textarea'

export const TipsForm = () => {
  const { register } = useFormContext<RecipeForm>()

  return (
    <Textarea
      {...register('tips')}
      id="tips"
      title="Tips"
      placeholder="Any helpful tips or notes for this recipe"
      rows={3}
    />
  )
}
