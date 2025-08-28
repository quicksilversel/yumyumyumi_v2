'use client'

import { useState } from 'react'

import AddIcon from '@mui/icons-material/Add'

import { AddRecipeDialog } from '../Modals/AddRecipeDialog'

export const AddRecipeButton = () => {
  const [addRecipeOpen, setAddRecipeOpen] = useState(false)

  return (
    <>
      <button onClick={() => setAddRecipeOpen(true)}>
        <AddIcon />
      </button>
      <AddRecipeDialog
        open={addRecipeOpen}
        onClose={() => setAddRecipeOpen(false)}
        onRecipeAdded={() => {
          window.location.reload()
        }}
      />
    </>
  )
}
