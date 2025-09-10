import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any

// Mock window.alert
global.alert = jest.fn()

// Mock Request/Response for Next.js cache
if (typeof global.Request === 'undefined') {
  global.Request = jest.fn() as any
}

if (typeof global.Response === 'undefined') {
  global.Response = jest.fn() as any
}

// Mock next/cache unstable_cache
jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
