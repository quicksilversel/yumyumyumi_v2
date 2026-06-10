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

// Mock NextResponse for API route tests
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: (data: any, init?: ResponseInit) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}))

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost/test'
process.env.AUTH_SECRET = 'test-auth-secret'
process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_test_token'
