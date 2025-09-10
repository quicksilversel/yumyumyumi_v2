/**
 * @jest-environment node
 */

// Mock Next.js modules first
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: jest.fn().mockResolvedValue(data),
      status: init?.status || 200,
      ok: init?.status ? init.status >= 200 && init.status < 300 : true,
    })),
  },
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}))

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { POST } from './route'

describe('POST /api/upload-image', () => {
  const mockSupabaseClient = {
    storage: {
      from: jest.fn(),
    },
  }

  const mockStorageBucket = {
    upload: jest.fn(),
    getPublicUrl: jest.fn(),
  }

  const mockFile = {
    name: 'test.jpg',
    type: 'image/jpeg',
    size: 100,
    arrayBuffer: jest
      .fn()
      .mockResolvedValue(Buffer.from('test image content').buffer),
  } as unknown as File

  const createFormData = (
    file?: File | any,
    userId?: string,
    recipeId?: string,
  ) => {
    const formData = {
      get: jest.fn((key: string) => {
        if (key === 'file') return file
        if (key === 'userId') return userId
        if (key === 'recipeId') return recipeId
        return null
      }),
    }
    return formData
  }

  const createMockRequest = (formData: any) => {
    return {
      formData: jest.fn().mockResolvedValue(formData),
    } as unknown as NextRequest
  }

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
    ;(createClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.storage.from.mockReturnValue(mockStorageBucket)
    ;(cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(null),
    })
  })

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
  })

  describe('successful upload', () => {
    it('should upload image successfully with all required fields', async () => {
      const formData = createFormData(mockFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      mockStorageBucket.upload.mockResolvedValue({
        data: { path: 'user123_recipe456_timestamp_random.webp' },
        error: null,
      })

      mockStorageBucket.getPublicUrl.mockReturnValue({
        data: {
          publicUrl:
            'https://test.supabase.co/storage/v1/object/public/recipe-images/test.webp',
        },
      })

      const response = await POST(request)
      const responseData = (NextResponse.json as jest.Mock).mock.calls[0]

      expect(responseData[0]).toEqual({
        url: 'https://test.supabase.co/storage/v1/object/public/recipe-images/test.webp',
        path: 'user123_recipe456_timestamp_random.webp',
        success: true,
      })
      expect(responseData[1]).toBeUndefined() // No error status

      expect(mockStorageBucket.upload).toHaveBeenCalledWith(
        expect.stringContaining('user123_recipe456_'),
        expect.any(Buffer),
        expect.objectContaining({
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true,
        }),
      )
    })

    it('should handle auth token from cookies', async () => {
      const mockCookieStore = {
        get: jest
          .fn()
          .mockReturnValueOnce({ value: 'test-auth-token' })
          .mockReturnValueOnce(null),
      }
      ;(cookies as jest.Mock).mockResolvedValue(mockCookieStore)

      const formData = createFormData(mockFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      mockStorageBucket.upload.mockResolvedValue({
        data: { path: 'test.webp' },
        error: null,
      })

      mockStorageBucket.getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://test.url' },
      })

      await POST(request)

      expect(mockCookieStore.get).toHaveBeenCalledWith('sb-access-token')
    })
  })

  describe('validation errors', () => {
    it('should return 400 when file is missing', async () => {
      const formData = createFormData(undefined, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'Missing required fields' })
      expect(callArgs[1]).toEqual({ status: 400 })
    })

    it('should return 400 when userId is missing', async () => {
      const formData = createFormData(mockFile, undefined, 'recipe456')
      const request = createMockRequest(formData)

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'Missing required fields' })
      expect(callArgs[1]).toEqual({ status: 400 })
    })

    it('should return 400 when recipeId is missing', async () => {
      const formData = createFormData(mockFile, 'user123', undefined)
      const request = createMockRequest(formData)

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'Missing required fields' })
      expect(callArgs[1]).toEqual({ status: 400 })
    })

    it('should return 400 when file size exceeds 2MB', async () => {
      const largeFile = {
        name: 'large.jpg',
        type: 'image/jpeg',
        size: 3 * 1024 * 1024, // 3MB
        arrayBuffer: jest.fn(),
      } as unknown as File

      const formData = createFormData(largeFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'File size must be less than 2MB' })
      expect(callArgs[1]).toEqual({ status: 400 })
    })
  })

  describe('configuration errors', () => {
    it('should return 500 when Supabase URL is missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const formData = createFormData(mockFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'Server configuration error' })
      expect(callArgs[1]).toEqual({ status: 500 })
      expect(consoleSpy).toHaveBeenCalledWith('Missing Supabase credentials')

      consoleSpy.mockRestore()
    })

    it('should return 500 when service role key is missing', async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const formData = createFormData(mockFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'Server configuration error' })
      expect(callArgs[1]).toEqual({ status: 500 })
      expect(consoleSpy).toHaveBeenCalledWith('Missing Supabase credentials')

      consoleSpy.mockRestore()
    })
  })

  describe('storage errors', () => {
    it('should handle storage upload error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      mockStorageBucket.upload.mockResolvedValue({
        data: null,
        error: { message: 'Storage failed' },
      })

      const formData = createFormData(mockFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'Upload failed: Storage failed' })
      expect(callArgs[1]).toEqual({ status: 500 })
      expect(consoleSpy).toHaveBeenCalledWith(
        'Storage upload error:',
        expect.objectContaining({ message: 'Storage failed' }),
      )

      consoleSpy.mockRestore()
    })

    it('should handle unexpected server errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const unexpectedError = new Error('Unexpected error')

      const request = {
        formData: jest.fn().mockRejectedValue(unexpectedError),
      } as unknown as NextRequest

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'Unexpected error' })
      expect(callArgs[1]).toEqual({ status: 500 })
      expect(consoleSpy).toHaveBeenCalledWith(
        'Server upload error:',
        unexpectedError,
      )

      consoleSpy.mockRestore()
    })
  })

  describe('file naming', () => {
    it('should generate unique filename with user and recipe IDs', async () => {
      const formData = createFormData(mockFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      mockStorageBucket.upload.mockResolvedValue({
        data: { path: 'test.webp' },
        error: null,
      })

      mockStorageBucket.getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://test.url' },
      })

      await POST(request)

      expect(mockStorageBucket.upload).toHaveBeenCalledWith(
        expect.stringMatching(/^user123_recipe456_\d+_[a-z0-9]{6}\.webp$/),
        expect.any(Buffer),
        expect.any(Object),
      )
    })

    it('should use webp extension regardless of input type', async () => {
      const pngFile = {
        name: 'test.png',
        type: 'image/png',
        size: 50,
        arrayBuffer: jest.fn().mockResolvedValue(Buffer.from('test').buffer),
      } as unknown as File
      const formData = createFormData(pngFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      mockStorageBucket.upload.mockResolvedValue({
        data: { path: 'test.webp' },
        error: null,
      })

      mockStorageBucket.getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://test.url' },
      })

      await POST(request)

      expect(mockStorageBucket.upload).toHaveBeenCalledWith(
        expect.stringMatching(/\.webp$/),
        expect.any(Buffer),
        expect.objectContaining({
          contentType: 'image/png',
        }),
      )
    })
  })

  describe('auth token handling', () => {
    it('should warn when no auth token found but proceed', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      ;(cookies as jest.Mock).mockResolvedValue({
        get: jest.fn().mockReturnValue(null),
      })

      const formData = createFormData(mockFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      mockStorageBucket.upload.mockResolvedValue({
        data: { path: 'test.webp' },
        error: null,
      })

      mockStorageBucket.getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://test.url' },
      })

      await POST(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'No auth token found, but proceeding with service role',
      )

      consoleSpy.mockRestore()
    })

    it('should check for alternative cookie name pattern', async () => {
      const mockCookieStore = {
        get: jest
          .fn()
          .mockReturnValueOnce(null) // sb-access-token
          .mockReturnValueOnce({ value: 'alt-token' }), // sb-{project}-auth-token
      }
      ;(cookies as jest.Mock).mockResolvedValue(mockCookieStore)

      const formData = createFormData(mockFile, 'user123', 'recipe456')
      const request = createMockRequest(formData)

      mockStorageBucket.upload.mockResolvedValue({
        data: { path: 'test.webp' },
        error: null,
      })

      mockStorageBucket.getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://test.url' },
      })

      await POST(request)

      expect(mockCookieStore.get).toHaveBeenCalledTimes(2)
      expect(mockCookieStore.get).toHaveBeenNthCalledWith(
        2,
        'sb-test-auth-token',
      )
    })
  })
})
