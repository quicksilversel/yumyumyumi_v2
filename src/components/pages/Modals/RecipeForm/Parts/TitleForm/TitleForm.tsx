import styled from '@emotion/styled'
import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types'

import { Input } from '@/components/ui/Forms/Input'
import { colors } from '@/styles/designTokens'

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
        title="料理名"
        placeholder="Enter recipe title"
        required
        error={!!errors.title?.message}
      />
      {errors.title?.message && <ErrorText>{errors.title.message}</ErrorText>}
    </Container>
  )
}

const ErrorText = styled.span`
  color: ${colors.error};
  font-size: 12px;
  margin-top: 4px;
`

const Container = styled.div`
  width: 100%;
`
