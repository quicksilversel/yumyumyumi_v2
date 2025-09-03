import { createBrowserClient } from '@supabase/ssr'

import { getSupabaseClient } from './getSupabaseClient'

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}))

describe('getSupabaseClient', () => {
  const mockSupabaseUrl = 'https://test.supabase.co'
  const mockSupabaseAnonKey = 'test-anon-key'

  beforeEach(() => {
    jest.clearAllMocks()

    jest.resetModules()

    process.env.NEXT_PUBLIC_SUPABASE_URL = mockSupabaseUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockSupabaseAnonKey
  })

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  it('should create a supabase client with correct parameters', () => {
    const mockClient = { auth: {}, from: jest.fn() }
    ;(createBrowserClient as jest.Mock).mockReturnValue(mockClient)

    const client = getSupabaseClient()

    expect(createBrowserClient).toHaveBeenCalledTimes(1)
    expect(createBrowserClient).toHaveBeenCalledWith(
      mockSupabaseUrl,
      mockSupabaseAnonKey,
    )
    expect(client).toBe(mockClient)
  })

  it('should cache the client instance', () => {
    const mockClient = { auth: {}, from: jest.fn() }
    ;(createBrowserClient as jest.Mock).mockReturnValue(mockClient)

    const client1 = getSupabaseClient()
    const client2 = getSupabaseClient()

    expect(client1).toBe(client2)
  })

  it('should throw an error if NEXT_PUBLIC_SUPABASE_URL is not set', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL

    expect(() => getSupabaseClient()).toThrow()
  })

  it('should throw an error if NEXT_PUBLIC_SUPABASE_ANON_KEY is not set', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(() => getSupabaseClient()).toThrow()
  })
})
