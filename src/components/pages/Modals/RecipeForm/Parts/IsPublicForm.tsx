import { ToggleSwitch } from '@/components/ui/Forms/ToggleSwitch'
import { Caption } from '@/components/ui/Typography'
import { useRecipeForm } from '@/contexts/RecipeFormContext'

type Props = {
  mode: 'new' | 'edit'
}

export function IsPublicForm({ mode }: Props) {
  const { recipe, setRecipe } = useRecipeForm(mode)

  const handleIsPublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe((prev) => ({ ...prev, isPublic: e.target.checked }))
  }

  return (
    <>
      <ToggleSwitch
        label="Make this recipe public"
        checked={recipe.isPublic ?? true}
        onChange={handleIsPublicChange}
      />
      <Caption>Public recipes can be viewed by anyone</Caption>
    </>
  )
}
