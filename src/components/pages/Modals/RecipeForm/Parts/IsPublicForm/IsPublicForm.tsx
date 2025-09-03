import { useFormContext, Controller } from 'react-hook-form'

import type { RecipeForm } from '@/types'

import { ToggleSwitch } from '@/components/ui/Forms/ToggleSwitch'
import { Caption } from '@/components/ui/Typography'

export function IsPublicForm() {
  const { control } = useFormContext<RecipeForm>()

  return (
    <>
      <Controller
        name="isPublic"
        control={control}
        render={({ field }) => (
          <ToggleSwitch
            label="Make this recipe public"
            checked={field.value ?? true}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />
      <Caption>Public recipes can be viewed by anyone</Caption>
    </>
  )
}
