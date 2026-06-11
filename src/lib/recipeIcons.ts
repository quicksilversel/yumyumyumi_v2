export const RECIPE_ICONS = [
  '/star-icon.png',
  '/flower-icon.png',
  '/heart-icon.png',
] as const

export function pickRecipeIcon(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) & 0xffffffff
  }
  return RECIPE_ICONS[Math.abs(hash) % RECIPE_ICONS.length]
}
