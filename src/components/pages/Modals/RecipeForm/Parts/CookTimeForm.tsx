import { Input } from '@/components/ui/Forms/Input'
import { useRecipeForm } from '@/contexts/RecipeFormContext'

type Props = {
  mode: 'new' | 'edit'
}

export const CookTimeForm = ({ mode }: Props) => {
  const { recipe, setRecipe } = useRecipeForm(mode)

  const handleCookTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe((prev) => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))
  }

  return (
    <Input
      id="cookTime"
      title="Cook Time (minutes)"
      type="number"
      value={recipe.cookTime || 0}
      onChange={handleCookTimeChange}
      placeholder="Enter cook time in minutes"
    />
  )
}
