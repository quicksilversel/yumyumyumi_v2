import { useState } from 'react'

import { Plus as AddIcon } from 'lucide-react'

import { AddRecipeDialog } from '../../features/Modals/AddRecipeDialog'

export const AddRecipeButton = () => {
  const [addRecipeOpen, setAddRecipeOpen] = useState(false)

  return (
    <>
      <button onClick={() => setAddRecipeOpen(true)} type="button">
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
