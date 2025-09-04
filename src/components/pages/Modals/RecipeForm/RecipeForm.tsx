import {
  CategoryForm,
  CookTimeForm,
  DirectionsForm,
  ImageForm,
  IngredientsForm,
  IsPublicForm,
  ServingsForm,
  SourceForm,
  SummaryForm,
  TagsForm,
  TipsForm,
  TitleForm,
} from '@/components/pages/Modals/RecipeForm/Parts'
import { Stack, Divider, Grid, ErrorText } from '@/components/ui'

type Props = {
  errors?: string[]
  handleImageChange?: (file: File | null, preview: string) => void
  uploadingImage?: boolean
}

export const RecipeForm = ({
  errors = [],
  handleImageChange,
  uploadingImage = false,
}: Props) => {
  return (
    <Stack gap={6}>
      {errors.length > 0 && (
        <Stack gap={2}>
          {errors.map((error, index) => (
            <ErrorText key={index}>{error}</ErrorText>
          ))}
        </Stack>
      )}
      <Stack gap={4}>
        <ImageForm
          onImageChange={handleImageChange}
          uploading={uploadingImage}
        />
        <TitleForm />
        <SummaryForm />
        <Grid cols={3} gap={4} responsive>
          <CategoryForm />
          <CookTimeForm />
          <ServingsForm />
        </Grid>
      </Stack>
      <Divider />
      <IngredientsForm />
      <Divider />
      <DirectionsForm />
      <Divider />
      <TagsForm />
      <SourceForm />
      <TipsForm />
      <IsPublicForm />
    </Stack>
  )
}
