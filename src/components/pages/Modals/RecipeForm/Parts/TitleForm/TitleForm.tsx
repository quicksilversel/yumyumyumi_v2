import styled from '@emotion/styled'
import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Input, ErrorText } from '@/components/ui'

export const TitleForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RecipeForm>()

  return (
    <Container>
      <Input
        {...register('title', {
          required: 'Recipe title is required',
        })}
        id="title"
        title="Title"
        placeholder="Enter recipe title"
        required
        error={!!errors.title?.message}
      />
      {errors.title?.message && <ErrorText>{errors.title.message}</ErrorText>}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
`
