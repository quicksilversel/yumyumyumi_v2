'use client'

import { useState } from 'react'

import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'

import type { Recipe } from '@/types'

import { Button } from '@/components/ui'
import { Dialog } from '@/components/ui'
import { Body } from '@/components/ui'
import { deleteRecipe } from '@/lib/supabase/supabaseRecipeService'
import { spacing } from '@/styles/designTokens'

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
      alert('Failed to delete recipe')
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
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      }
    >
      <DialogContent>
        <Body>
          Are you sure you want to delete &quot;{recipe.title}&quot;? This
          action cannot be undone.
        </Body>
      </DialogContent>
    </Dialog>
  )
}

const DialogContent = styled.div`
  padding: ${spacing[4]};
`

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing[3]};
  margin-top: ${spacing[6]};
`
