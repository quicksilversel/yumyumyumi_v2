'use client'

import { useState } from 'react'

import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'

import type { Recipe } from '@/types/recipe'

import { Button, Dialog, Body } from '@/components/ui'
import { deleteRecipe } from '@/lib/supabase/tables/recipe/deleteRecipe'

type Props = {
  open: boolean
  onClose: () => void
  recipe: Recipe
  onRecipeUpdated?: (recipe: Recipe) => void
}

export const DeleteRecipeModal = ({ recipe, open, onClose }: Props) => {
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const success = await deleteRecipe(recipe.id)
    if (success) {
      router.push('/')
    } else {
      alert(
        'ご迷惑をお掛けし申し訳ありません。\n時間をおいて再度お試しください。',
      )
    }
    setIsDeleting(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Delete Recipe"
      actions={
        <DialogActions>
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '削除中...' : '削除する'}
          </Button>
        </DialogActions>
      }
    >
      <DialogContent>
        <Body>
          「{recipe.title}」を削除してもよろしいですか？
          この操作は元に戻すことができません。
        </Body>
      </DialogContent>
    </Dialog>
  )
}

const DialogContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[6]};
`
