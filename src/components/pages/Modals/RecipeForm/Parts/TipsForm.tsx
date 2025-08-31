import { Textarea } from '@/components/ui/Forms/Textarea'
import { useRecipeForm } from '@/contexts/RecipeFormContext'

type Props = {
  mode: 'new' | 'edit'
}

export const TipsForm = ({ mode }: Props) => {
  const { recipe, setRecipe } = useRecipeForm(mode)

  const handleTipsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRecipe((prev) => ({ ...prev, tips: e.target.value }))
  }

  return (
    <Textarea
      id="tips"
      title="Tips"
      value={recipe.tips || ''}
      onChange={handleTipsChange}
      placeholder="Any helpful tips or notes for this recipe"
      rows={3}
    />
  )
}
