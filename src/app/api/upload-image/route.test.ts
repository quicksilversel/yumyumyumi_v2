/**
 * @jest-environment node
 */

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

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@vercel/blob', () => ({ put: jest.fn(), del: jest.fn() }))

import { del, put } from '@vercel/blob'
import { NextResponse } from 'next/server'

import { auth } from '@/auth'

import { DELETE, POST } from './route'

const mockAuth = auth as unknown as jest.Mock
const mockPut = put as jest.Mock
const mockDel = del as jest.Mock

describe('upload-image route', () => {
  const mockFile = {
    name: 'test.jpg',
    type: 'image/jpeg',
    size: 100,
  } as unknown as File

  const createFormData = (file?: unknown, userId?: string, recipeId?: string) =>
    ({
      get: jest.fn((key: string) => {
        if (key === 'file') return file
        if (key === 'userId') return userId
        if (key === 'recipeId') return recipeId
        return null
      }),
    }) as unknown

  const createRequest = (overrides: Record<string, unknown>) =>
    overrides as never

  beforeEach(() => {
    jest.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { id: 'user123' } })
  })

  describe('POST', () => {
    it('returns 401 when unauthenticated', async () => {
      mockAuth.mockResolvedValue(null)

      const request = createRequest({
        formData: jest
          .fn()
          .mockResolvedValue(createFormData(mockFile, 'user123', 'recipe456')),
      })

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[1]).toEqual({ status: 401 })
    })

    it('returns 400 when a required field is missing', async () => {
      const request = createRequest({
        formData: jest
          .fn()
          .mockResolvedValue(createFormData(mockFile, undefined, 'recipe456')),
      })

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'Missing required fields' })
      expect(callArgs[1]).toEqual({ status: 400 })
    })

    it('returns 400 when file exceeds 2MB', async () => {
      const largeFile = {
        type: 'image/jpeg',
        size: 3 * 1024 * 1024,
      } as unknown as File

      const request = createRequest({
        formData: jest
          .fn()
          .mockResolvedValue(createFormData(largeFile, 'user123', 'recipe456')),
      })

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'File size must be less than 2MB' })
      expect(callArgs[1]).toEqual({ status: 400 })
    })

    it('uploads to Vercel Blob and returns the url', async () => {
      mockPut.mockResolvedValue({
        url: 'https://abc.public.blob.vercel-storage.com/recipe-images/x.webp',
      })

      const request = createRequest({
        formData: jest
          .fn()
          .mockResolvedValue(createFormData(mockFile, 'user123', 'recipe456')),
      })

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({
        url: 'https://abc.public.blob.vercel-storage.com/recipe-images/x.webp',
        success: true,
      })

      expect(mockPut).toHaveBeenCalledWith(
        expect.stringMatching(
          /^recipe-images\/user123_recipe456_\d+_[a-z0-9]{6}\.webp$/,
        ),
        mockFile,
        expect.objectContaining({
          access: 'public',
          contentType: 'image/jpeg',
        }),
      )
    })

    it('handles unexpected errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const request = createRequest({
        formData: jest.fn().mockRejectedValue(new Error('boom')),
      })

      await POST(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ error: 'boom' })
      expect(callArgs[1]).toEqual({ status: 500 })

      consoleSpy.mockRestore()
    })
  })

  describe('DELETE', () => {
    it('returns 401 when unauthenticated', async () => {
      mockAuth.mockResolvedValue(null)

      const request = createRequest({
        json: jest.fn().mockResolvedValue({ url: 'https://blob/x.webp' }),
      })

      await DELETE(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[1]).toEqual({ status: 401 })
    })

    it('returns 400 when url is missing', async () => {
      const request = createRequest({
        json: jest.fn().mockResolvedValue({}),
      })

      await DELETE(request)

      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[1]).toEqual({ status: 400 })
    })

    it('deletes the blob', async () => {
      mockDel.mockResolvedValue(undefined)

      const request = createRequest({
        json: jest.fn().mockResolvedValue({ url: 'https://blob/x.webp' }),
      })

      await DELETE(request)

      expect(mockDel).toHaveBeenCalledWith('https://blob/x.webp')
      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({ success: true })
    })
  })
})
