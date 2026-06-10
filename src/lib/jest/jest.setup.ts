import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any

global.alert = jest.fn()

if (typeof global.Request === 'undefined') {
  global.Request = jest.fn() as any
}

if (typeof global.Response === 'undefined') {
  global.Response = jest.fn() as any
}

jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: (data: any, init?: ResponseInit) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}))

process.env.DATABASE_URL = 'postgresql://test:test@localhost/test'
process.env.AUTH_SECRET = 'test-auth-secret'
process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_test_token'
