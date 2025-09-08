import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Input } from '@/components/ui/Forms/Input'

export const SourceForm = () => {
  const { register } = useFormContext<RecipeForm>()

  return (
    <Input
      {...register('source')}
      id="source"
      title="Source"
      placeholder="参考サイトや書籍名を入力してください"
    />
  )
}
