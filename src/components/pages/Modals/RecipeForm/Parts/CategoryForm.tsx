import { Select } from '@/components/ui/Forms/Select'
import { useRecipeForm } from '@/contexts/RecipeFormContext'
import { RecipeCategory } from '@/types'

type Props = {
  mode: 'new' | 'edit'
}

export const CategoryForm = ({ mode }: Props) => {
  const { recipe, setRecipe } = useRecipeForm(mode)
  const categories = Object.values(RecipeCategory)

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value as RecipeCategory
    setRecipe((prev) => ({ ...prev, category }))
  }

  const options = categories.map((category) => ({
    value: category,
    label: category,
  }))

  return (
    <Select
      id="category"
      title="Category"
      value={recipe.category || ''}
      onChange={handleCategoryChange}
      options={options}
      fullWidth
    />
  )
}
