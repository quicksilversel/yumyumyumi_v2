import {
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
import { Stack, Divider, Grid, ErrorText, H2 } from '@/components/ui'

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
      <H2>General</H2>
      <TitleForm />
      <SummaryForm />
      <Grid cols={2} gap={4} responsive>
        <CookTimeForm />
        <ServingsForm />
      </Grid>
      <Divider />
      <IngredientsForm />
      <Divider />
      <DirectionsForm />
      <Divider />
      <H2>Details</H2>
      <ImageForm onImageChange={handleImageChange} uploading={uploadingImage} />
      <TagsForm />
      <SourceForm />
      <TipsForm />
      <IsPublicForm />
    </Stack>
  )
}
