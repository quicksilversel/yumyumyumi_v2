import { Input } from '@/components/ui/Forms/Input'
import { useRecipeForm } from '@/contexts/RecipeFormContext'

type Props = {
  mode: 'new' | 'edit'
}

export const ServingsForm = ({ mode }: Props) => {
  const { recipe, setRecipe } = useRecipeForm(mode)

  const handleServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe((prev) => ({ ...prev, servings: parseInt(e.target.value) || 0 }))
  }

  return (
    <Input
      id="servings"
      title="Servings"
      type="number"
      value={recipe.servings || 0}
      onChange={handleServingsChange}
      placeholder="Number of servings"
    />
  )
}
