import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

global.alert = vi.fn()

// next/cache is server-only; stub it so client/unit tests can import modules
// that reference it. (Route-level mocks like next/server live in their own test.)
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

process.env.DATABASE_URL = 'postgresql://test:test@localhost/test'
process.env.AUTH_SECRET = 'test-auth-secret'
process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_test_token'
