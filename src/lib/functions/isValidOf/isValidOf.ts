import type { z } from 'zod'
import type { ZodTypeAny } from 'zod'

export const isValidOf = <T extends ZodTypeAny>(
  schema: T,
  value: unknown,
): value is z.infer<typeof schema> => {
  const result = schema.safeParse(value)

  if (!result.success && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('Validation failed:', result.error)
  }

  return schema.safeParse(value).success
}
