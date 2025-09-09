import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Input } from '@/components/ui/Forms/Input'

export const SourceForm = () => {
  const { register, watch } = useFormContext<RecipeForm>()

  return (
    <Input
      {...register('source')}
      id="source"
      value={watch('source')}
      title="参考"
      placeholder="参考サイトや書籍名など"
    />
  )
}
