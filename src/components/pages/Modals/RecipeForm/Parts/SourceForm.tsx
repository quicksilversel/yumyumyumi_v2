import { Input } from '@/components/ui/Forms/Input'
import { useRecipeForm } from '@/contexts/RecipeFormContext'

type Props = {
  mode: 'new' | 'edit'
}

export const SourceForm = ({ mode }: Props) => {
  const { recipe, setRecipe } = useRecipeForm(mode)

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe((prev) => ({ ...prev, source: e.target.value }))
  }

  return (
    <Input
      id="source"
      title="Source"
      value={recipe.source || ''}
      onChange={handleSourceChange}
      placeholder="Recipe source or URL"
    />
  )
}
