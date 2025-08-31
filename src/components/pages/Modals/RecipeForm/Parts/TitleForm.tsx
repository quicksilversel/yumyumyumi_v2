import { Input } from '@/components/ui/Forms/Input'
import { useRecipeForm } from '@/contexts/RecipeFormContext'

type Props = {
  mode: 'new' | 'edit'
}

export function validateTitle(title: string): {
  isValid: boolean
  error?: string
} {
  if (!title?.trim()) {
    return {
      isValid: false,
      error: 'Recipe title is required',
    }
  }

  if (title.trim().length < 3) {
    return {
      isValid: false,
      error: 'Title must be at least 3 characters long',
    }
  }

  return { isValid: true }
}

export const TitleForm = ({ mode }: Props) => {
  const { recipe, setRecipe } = useRecipeForm(mode)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe((prev) => ({ ...prev, title: e.target.value }))
  }

  return (
    <Input
      id="title"
      title="料理名"
      value={recipe.title || ''}
      onChange={handleTitleChange}
      placeholder="Enter recipe title"
      required
    />
  )
}
