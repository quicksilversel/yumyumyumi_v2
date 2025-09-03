import styled from '@emotion/styled'

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
import { Stack, Divider, Grid } from '@/components/ui/Layout'
import { colors } from '@/styles/designTokens'

type Props = {
  errors?: string[]
  handleImageChange?: (file: File | null, preview: string) => void
  uploadingImage?: boolean
}

const ErrorMessage = styled.p`
  color: ${colors.error};
  font-size: 14px;
`

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
            <ErrorMessage key={index}>{error}</ErrorMessage>
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
