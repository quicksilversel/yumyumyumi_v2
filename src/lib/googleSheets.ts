import { Recipe, RecipeCategory } from '@/types'

const SPREADSHEET_ID = '1TmlxsBkGr_iWww1AeU8Xgq2fqWRDJky4AD56FumlfFI'
const SHEET_NAME = 'yumi-recipe'

export async function fetchRecipesFromGoogleSheets(): Promise<Recipe[]> {
  try {
    // Using Google Visualization API (no API key needed)
    const query = encodeURIComponent('Select *')
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${SHEET_NAME}&tq=${query}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.statusText}`)
    }

    const text = await response.text()

    // Remove the Google Visualization API wrapper
    // Response format: google.visualization.Query.setResponse({...})
    const jsonMatch = text.match(
      /google\.visualization\.Query\.setResponse\((.*)\);?$/,
    )

    if (!jsonMatch) {
      throw new Error('Invalid response format from Google Sheets')
    }

    const data = JSON.parse(jsonMatch[1])

    if (!data.table || !data.table.rows) {
      return []
    }

    const recipes: Recipe[] = data.table.rows.map((row: any, index: number) => {
      const getValue = (colIndex: number) => {
        return row.c[colIndex]?.v || row.c[colIndex]?.f || ''
      }

      // Map columns based on original spreadsheet structure
      return {
        id: getValue(0) || `recipe-${index + 1}`,
        title: getValue(1) || '',
        summary: getValue(2) || '',
        ingredients: parseArrayField(getValue(3)),
        directions: parseArrayField(getValue(4)),
        tips: getValue(5) || undefined,
        prepTime: parseInt(getValue(6)) || 0,
        cookTime: parseInt(getValue(7)) || 0,
        totalTime: parseInt(getValue(8)) || 0,
        servings: parseInt(getValue(9)) || 1,
        category: mapCategory(getValue(10)) || RecipeCategory.MAIN_COURSE,
        imageUrl: getValue(11) || '/placeholder-recipe.jpg',
        source: getValue(12) || undefined,
        createdAt: getValue(13) || new Date().toISOString(),
        updatedAt: getValue(14) || new Date().toISOString(),
      }
    })

    return recipes
  } catch (error) {
    console.warn('Error fetching recipes from Google Sheets:', error)
    // Return empty array instead of throwing to allow the app to run
    return []
  }
}

function parseArrayField(field: string | any): string[] {
  if (!field) return []

  // If it's already an array from the spreadsheet
  if (Array.isArray(field)) return field

  const fieldStr = String(field)

  try {
    // Check if it's a JSON array
    if (fieldStr.startsWith('[') && fieldStr.endsWith(']')) {
      return JSON.parse(fieldStr)
    }

    // Check for semicolon-separated values (common in spreadsheets)
    if (fieldStr.includes(';')) {
      return fieldStr
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean)
    }

    // Check for newline-separated values
    if (fieldStr.includes('\n')) {
      return fieldStr
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
    }

    // Default to comma-separated
    return fieldStr
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  } catch {
    return fieldStr
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
}

function mapCategory(category: string): RecipeCategory {
  const categoryMap: Record<string, RecipeCategory> = {
    appetizer: RecipeCategory.APPETIZER,
    'main course': RecipeCategory.MAIN_COURSE,
    main: RecipeCategory.MAIN_COURSE,
    dessert: RecipeCategory.DESSERT,
    breakfast: RecipeCategory.BREAKFAST,
    lunch: RecipeCategory.LUNCH,
    dinner: RecipeCategory.DINNER,
    snack: RecipeCategory.SNACK,
    beverage: RecipeCategory.BEVERAGE,
    drink: RecipeCategory.BEVERAGE,
    salad: RecipeCategory.SALAD,
    soup: RecipeCategory.SOUP,
    'side dish': RecipeCategory.SIDE_DISH,
    side: RecipeCategory.SIDE_DISH,
    sauce: RecipeCategory.SAUCE,
    baking: RecipeCategory.BAKING,
  }

  const normalized = category?.toLowerCase().trim()
  return categoryMap[normalized] || RecipeCategory.MAIN_COURSE
}
