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
    <Stack gap={4}>
      {errors.length > 0 && (
        <Stack gap={2}>
          {errors.map((error, index) => (
            <ErrorText key={index}>{error}</ErrorText>
          ))}
        </Stack>
      )}
      <H2>基本情報</H2>
      <TitleForm />
      <SummaryForm />
      <TagsForm />
      <H2>その他</H2>
      <Grid cols={2} gap={4} responsive>
        <CookTimeForm />
        <ServingsForm />
      </Grid>
      <Divider />
      <IngredientsForm />
      <Divider />
      <DirectionsForm />
      <Divider />
      <ImageForm onImageChange={handleImageChange} uploading={uploadingImage} />
      <SourceForm />
      <TipsForm />
      <IsPublicForm />
    </Stack>
  )
}
