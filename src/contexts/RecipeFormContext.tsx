import { createContext, useContext, useState, ReactNode } from 'react'

import type { Recipe } from '@/types'

interface RecipeFormContextType {
  recipe: Partial<Recipe>
  setRecipe: React.Dispatch<React.SetStateAction<Partial<Recipe>>>
}

// Context for creating a new recipe
const NewRecipeContext = createContext<RecipeFormContextType | undefined>(
  undefined,
)

// Context for editing an existing recipe
const EditRecipeContext = createContext<RecipeFormContextType | undefined>(
  undefined,
)

// Provider for new recipe
export const NewRecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    title: '',
    summary: '',
    ingredients: [],
    directions: [],
    tags: [],
    tips: '',
    cookTime: 30,
    servings: 4,
    category: 'Main Course',
    imageUrl: '',
    source: '',
    isPublic: true,
  })

  return (
    <NewRecipeContext.Provider value={{ recipe, setRecipe }}>
      {children}
    </NewRecipeContext.Provider>
  )
}

// Provider for editing recipe
interface EditRecipeProviderProps {
  children: ReactNode
  initialRecipe: Recipe
}

export const EditRecipeProvider = ({
  children,
  initialRecipe,
}: EditRecipeProviderProps) => {
  const [recipe, setRecipe] = useState<Partial<Recipe>>(initialRecipe)

  return (
    <EditRecipeContext.Provider value={{ recipe, setRecipe }}>
      {children}
    </EditRecipeContext.Provider>
  )
}

// Hook to use new recipe context
export const useNewRecipe = () => {
  const context = useContext(NewRecipeContext)
  if (context === undefined) {
    throw new Error('useNewRecipe must be used within a NewRecipeProvider')
  }
  return context
}

// Hook to use edit recipe context
export const useEditRecipe = () => {
  const context = useContext(EditRecipeContext)
  if (context === undefined) {
    throw new Error('useEditRecipe must be used within an EditRecipeProvider')
  }
  return context
}

// Generic hook that can be used in components that work with both contexts
export const useRecipeForm = (mode: 'new' | 'edit') => {
  const newRecipeContext = useContext(NewRecipeContext)
  const editRecipeContext = useContext(EditRecipeContext)

  if (mode === 'new') {
    if (newRecipeContext === undefined) {
      throw new Error(
        'useRecipeForm with mode "new" must be used within a NewRecipeProvider',
      )
    }
    return newRecipeContext
  } else {
    if (editRecipeContext === undefined) {
      throw new Error(
        'useRecipeForm with mode "edit" must be used within an EditRecipeProvider',
      )
    }
    return editRecipeContext
  }
}
