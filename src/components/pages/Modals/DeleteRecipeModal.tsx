'use client'

import styled from '@emotion/styled'

import { Button, Dialog, Body, ErrorText } from '@/components/ui'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  recipeTitle: string
  isDeleting?: boolean
  error?: string | null
}

export const DeleteRecipeModal = ({
  open,
  onClose,
  onConfirm,
  recipeTitle,
  isDeleting = false,
  error,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="レシピを削除"
      actions={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? '削除中...' : '削除する'}
          </Button>
        </>
      }
    >
      <DialogContent>
        <Body>「{recipeTitle}」を削除しますか？</Body>
        {error && <ErrorText>{error}</ErrorText>}
      </DialogContent>
    </Dialog>
  )
}

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
`
