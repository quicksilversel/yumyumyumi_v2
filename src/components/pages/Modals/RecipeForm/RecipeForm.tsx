import {
  CategoryForm,
  CookTimeForm,
  DirectionsForm,
  ImageUploadForm,
  IngredientsForm,
  IsPublicForm,
  ServingsForm,
  SourceForm,
  SummaryForm,
  TagsForm,
  TipsForm,
  TitleForm,
} from '@/components/pages/Modals/RecipeForm/Parts'
import { Stack, Divider, Grid } from '@/components/ui/Layout'

type Props = {
  mode: 'edit' | 'new'
  errors: string[]
  handleImageChange: (file: File | null) => void
  uploadingImage: boolean
}

export const RecipeForm = ({
  mode,
  errors,
  handleImageChange,
  uploadingImage,
}: Props) => {
  return (
    <Stack gap={6}>
      {errors.length > 0 && (
        <Stack gap={2}>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </Stack>
      )}
      <Stack gap={4}>
        <ImageUploadForm
          mode={mode}
          onImageChange={handleImageChange}
          uploading={uploadingImage}
        />
        <TitleForm mode={mode} />
        <SummaryForm mode={mode} />

        <Grid cols={3} gap={4}>
          <CategoryForm mode={mode} />

          <CookTimeForm mode={mode} />
          <ServingsForm mode={mode} />
        </Grid>
      </Stack>
      <Divider />
      <IngredientsForm mode={mode} />
      <Divider />
      <DirectionsForm mode={mode} />
      <Divider />
      <TagsForm mode={mode} />
      <SourceForm mode={mode} />
      <TipsForm mode={mode} />
      <IsPublicForm mode={mode} />
    </Stack>
  )
}
