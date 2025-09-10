/**
 * @jest-environment node
 */

// Mock Next.js modules first
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

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

import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { POST, GET } from './route'

describe('/api/revalidate', () => {
  const mockWebhookSecret = 'test-webhook-secret'

  const createMockRequest = (
    payload: any,
    secret?: string,
  ): NextRequest => {
    return {
      headers: {
        get: jest.fn((name) => {
          if (name === 'x-webhook-secret') return secret || null
          return null
        }),
      },
      json: jest.fn().mockResolvedValue(payload),
    } as unknown as NextRequest
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(NextResponse.json as jest.Mock).mockClear()
    process.env.SUPABASE_WEBHOOK_SECRET = mockWebhookSecret
  })

  afterEach(() => {
    delete process.env.SUPABASE_WEBHOOK_SECRET
  })

  describe('POST /api/revalidate', () => {
    describe('authentication', () => {
      it('should return 500 when webhook secret is not configured', async () => {
        delete process.env.SUPABASE_WEBHOOK_SECRET
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

        const request = createMockRequest({}, mockWebhookSecret)
        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0]).toEqual({ error: 'Server configuration error' })
        expect(callArgs[1]).toEqual({ status: 500 })
        expect(consoleSpy).toHaveBeenCalledWith(
          'SUPABASE_WEBHOOK_SECRET not configured',
        )

        consoleSpy.mockRestore()
      })

      it('should return 401 when webhook secret does not match', async () => {
        const request = createMockRequest({}, 'wrong-secret')
        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0]).toEqual({ error: 'Unauthorized' })
        expect(callArgs[1]).toEqual({ status: 401 })
      })

      it('should return 401 when webhook secret is missing', async () => {
        const request = createMockRequest({})
        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0]).toEqual({ error: 'Unauthorized' })
        expect(callArgs[1]).toEqual({ status: 401 })
      })
    })

    describe('recipes table webhooks', () => {
      it('should revalidate paths for INSERT operation', async () => {
        const payload = {
          type: 'INSERT',
          table: 'recipes',
          record: { id: 'recipe123', title: 'New Recipe' },
          schema: 'public',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0]).toEqual({
          revalidated: true,
          timestamp: expect.any(String),
          table: 'recipes',
          type: 'INSERT',
        })
        expect(callArgs[1]).toBeUndefined()

        expect(revalidatePath).toHaveBeenCalledWith('/')
        expect(revalidatePath).toHaveBeenCalledWith('/recipes/recipe123')
        expect(revalidatePath).toHaveBeenCalledWith('/recipes/[id]', 'page')
        expect(revalidateTag).toHaveBeenCalledWith('recipes')
        expect(revalidateTag).toHaveBeenCalledWith('recipes-list')
      })

      it('should revalidate paths for UPDATE operation', async () => {
        const payload = {
          type: 'UPDATE',
          table: 'recipes',
          record: { id: 'recipe456', title: 'Updated Recipe' },
          old_record: { id: 'recipe456', title: 'Old Recipe' },
          schema: 'public',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0].type).toBe('UPDATE')
        expect(revalidatePath).toHaveBeenCalledWith('/recipes/recipe456')
      })

      it('should revalidate paths for DELETE operation using old_record', async () => {
        const payload = {
          type: 'DELETE',
          table: 'recipes',
          old_record: { id: 'recipe789', title: 'Deleted Recipe' },
          schema: 'public',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0].type).toBe('DELETE')
        expect(revalidatePath).toHaveBeenCalledWith('/recipes/recipe789')
      })

      it('should handle recipes without ID', async () => {
        const payload = {
          type: 'INSERT',
          table: 'recipes',
          record: { title: 'No ID Recipe' },
          schema: 'public',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)

        expect(revalidatePath).toHaveBeenCalledWith('/')
        expect(revalidatePath).not.toHaveBeenCalledWith(
          expect.stringContaining('/recipes/'),
        )
      })
    })

    describe('bookmarks table webhooks', () => {
      it('should revalidate bookmarks tag', async () => {
        const payload = {
          type: 'INSERT',
          table: 'bookmarks',
          record: {
            id: 'bookmark123',
            recipe_id: 'recipe123',
            user_id: 'user123',
          },
          schema: 'public',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0]).toEqual({
          revalidated: true,
          timestamp: expect.any(String),
          table: 'bookmarks',
          type: 'INSERT',
        })

        expect(revalidateTag).toHaveBeenCalledWith('bookmarks')
        expect(revalidatePath).toHaveBeenCalledWith('/recipes/recipe123')
      })

      it('should handle bookmarks without recipe_id', async () => {
        const payload = {
          type: 'DELETE',
          table: 'bookmarks',
          old_record: { id: 'bookmark456', user_id: 'user123' },
          schema: 'public',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)

        expect(revalidateTag).toHaveBeenCalledWith('bookmarks')
        expect(revalidatePath).not.toHaveBeenCalledWith(
          expect.stringContaining('/recipes/'),
        )
      })
    })

    describe('unknown tables', () => {
      it('should log message for unknown tables', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
        const payload = {
          type: 'INSERT',
          table: 'unknown_table',
          record: { id: '123' },
          schema: 'public',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0].table).toBe('unknown_table')
        expect(consoleSpy).toHaveBeenCalledWith(
          'No revalidation rules for table:',
          'unknown_table',
        )

        consoleSpy.mockRestore()
      })
    })

    describe('error handling', () => {
      it('should handle JSON parsing errors', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        const request = {
          headers: {
            get: jest.fn().mockReturnValue(mockWebhookSecret),
          },
          json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        } as unknown as NextRequest

        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0]).toEqual({ error: 'Failed to process webhook' })
        expect(callArgs[1]).toEqual({ status: 500 })
        expect(consoleSpy).toHaveBeenCalledWith(
          'Revalidation error:',
          expect.any(Error),
        )

        consoleSpy.mockRestore()
      })

      it('should handle revalidation errors', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        const revalidateError = new Error('Revalidation failed')
        ;(revalidatePath as jest.Mock).mockImplementation(() => {
          throw revalidateError
        })

        const payload = {
          type: 'INSERT',
          table: 'recipes',
          record: { id: 'recipe123' },
          schema: 'public',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)
        
        const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
        expect(callArgs[0]).toEqual({ error: 'Failed to process webhook' })
        expect(callArgs[1]).toEqual({ status: 500 })
        expect(consoleSpy).toHaveBeenCalledWith(
          'Revalidation error:',
          revalidateError,
        )

        consoleSpy.mockRestore()
      })
    })

    describe('response format', () => {
      it('should include timestamp in ISO format', async () => {
        // Clear mocks specifically for this test
        jest.clearAllMocks()
        
        const payload = {
          type: 'INSERT',
          table: 'recipes',
          record: { id: '123' },
          schema: 'public',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)
        
        const mockCalls = (NextResponse.json as jest.Mock).mock.calls
        expect(mockCalls).toHaveLength(1)
        const responseData = mockCalls[0][0]
        expect(responseData).toHaveProperty('timestamp')
        expect(responseData.timestamp).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        )
      })

      it('should preserve webhook type and table in response', async () => {
        // Clear mocks specifically for this test
        jest.clearAllMocks()
        
        const payload = {
          type: 'UPDATE',
          table: 'recipes',
          record: { id: '123' },
          schema: 'custom',
        }

        const request = createMockRequest(payload, mockWebhookSecret)
        await POST(request)
        
        const mockCalls = (NextResponse.json as jest.Mock).mock.calls
        expect(mockCalls).toHaveLength(1)
        expect(mockCalls[0][0].type).toBe('UPDATE')
        expect(mockCalls[0][0].table).toBe('recipes')
      })
    })
  })

  describe('GET /api/revalidate', () => {
    it('should return status ok', async () => {
      await GET()
      
      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0]
      expect(callArgs[0]).toEqual({
        status: 'ok',
        message: 'Revalidation endpoint is active',
      })
      expect(callArgs[1]).toBeUndefined()
    })
  })
})