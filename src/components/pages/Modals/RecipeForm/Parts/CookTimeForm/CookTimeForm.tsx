import styled from '@emotion/styled'
import { useFormContext } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { Input, ErrorText } from '@/components/ui'

export const CookTimeForm = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RecipeForm>()

  return (
    <Container>
      <Input
        {...register('cookTime', {
          required: 'Cook time is required',
          min: {
            value: 1,
            message: '調理時間は1分以上で入力してください',
          },
          valueAsNumber: true,
          validate: (value) => {
            if (isNaN(value)) {
              return '調理時間は有効な数字で入力してください'
            }
            if (value <= 0) {
              return '調理時間は0分より大きい数字で入力してください'
            }
            return true
          },
        })}
        id="cookTime"
        title="調理時間（分)"
        type="number"
        placeholder="調理時間を分単位で入力してください"
        min={1}
        value={watch('cookTime')}
        error={!!errors.cookTime}
        required
      />
      {errors.cookTime && <ErrorText>{errors.cookTime.message}</ErrorText>}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
`
