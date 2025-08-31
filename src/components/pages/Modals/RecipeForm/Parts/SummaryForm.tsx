import { Input } from '@/components/ui/Forms/Input'
import { useRecipeForm } from '@/contexts/RecipeFormContext'

type Props = {
  mode: 'new' | 'edit'
}

export const SummaryForm = ({ mode }: Props) => {
  const { recipe, setRecipe } = useRecipeForm(mode)

  const handleSummaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe((prev) => ({ ...prev, summary: e.target.value }))
  }

  return (
    <Input
      id="summary"
      title="Summary"
      value={recipe.summary || ''}
      onChange={handleSummaryChange}
      placeholder="Brief description of the recipe"
    />
  )
}
