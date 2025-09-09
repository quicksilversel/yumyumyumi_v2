import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Textarea } from '@/components/ui/Forms/Textarea'

export const TipsForm = () => {
  const { register, watch } = useFormContext<RecipeForm>()

  return (
    <Textarea
      {...register('tips')}
      id="tips"
      value={watch('tips')}
      title="ポイント"
      placeholder="ポイントやコツを入力してください"
      rows={5}
    />
  )
}
