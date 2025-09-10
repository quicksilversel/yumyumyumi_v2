import { ReactNode } from 'react'

import {
  renderHook,
  act,
  waitFor,
  render,
  screen,
} from '@testing-library/react'

import type { User } from '@supabase/supabase-js'

import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

import { AuthProvider, useAuth } from './AuthContext'

// Mock the Supabase client
jest.mock('@/lib/supabase/getSupabaseClient', () => ({
  getSupabaseClient: jest.fn(),
}))

describe('AuthContext', () => {
  const mockUser: User = {
    id: 'user123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
  } as User

  const mockSession = {
    user: mockUser,
    access_token: 'token123',
    refresh_token: 'refresh123',
  }

  const mockSupabaseAuth = {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  }

  const mockSupabaseClient = {
    auth: mockSupabaseAuth,
  }

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  )

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)

    // Default mock implementations
    mockSupabaseAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })

    mockSupabaseAuth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    })
  })

  describe('useAuth', () => {
    it('should throw error when used outside AuthProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within an AuthProvider')

      consoleError.mockRestore()
    })

    it('should provide initial context values', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      // Initially loading
      expect(result.current.loading).toBe(true)
      expect(result.current.user).toBeNull()

      // Wait for session check to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('initialization', () => {
    it('should load existing session on mount', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.user).toEqual(mockUser)
      })

      expect(mockSupabaseAuth.getSession).toHaveBeenCalledTimes(1)
    })

    it('should handle no existing session', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.user).toBeNull()
      })
    })

    it('should subscribe to auth state changes', () => {
      renderHook(() => useAuth(), { wrapper })

      expect(mockSupabaseAuth.onAuthStateChange).toHaveBeenCalledTimes(1)
      expect(mockSupabaseAuth.onAuthStateChange).toHaveBeenCalledWith(
        expect.any(Function),
      )
    })

    it('should unsubscribe on unmount', () => {
      const unsubscribe = jest.fn()
      mockSupabaseAuth.onAuthStateChange.mockReturnValue({
        data: {
          subscription: { unsubscribe },
        },
      })

      const { unmount } = renderHook(() => useAuth(), { wrapper })

      expect(unsubscribe).not.toHaveBeenCalled()

      unmount()

      expect(unsubscribe).toHaveBeenCalledTimes(1)
    })
  })

  describe('auth state changes', () => {
    it('should update user when auth state changes', async () => {
      let authChangeCallback: (event: any, session: any) => void

      mockSupabaseAuth.onAuthStateChange.mockImplementation((callback) => {
        authChangeCallback = callback
        return {
          data: {
            subscription: { unsubscribe: jest.fn() },
          },
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()

      // Simulate auth state change to signed in
      act(() => {
        authChangeCallback!('SIGNED_IN', mockSession)
      })

      expect(result.current.user).toEqual(mockUser)

      // Simulate auth state change to signed out
      act(() => {
        authChangeCallback!('SIGNED_OUT', null)
      })

      expect(result.current.user).toBeNull()
    })
  })

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const response = await act(async () => {
        return await result.current.signIn('test@example.com', 'password123')
      })

      expect(response).toEqual({ error: undefined })
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should handle sign in error', async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const response = await act(async () => {
        return await result.current.signIn('test@example.com', 'wrong')
      })

      expect(response).toEqual({ error: 'Invalid credentials' })
    })
  })

  describe('signUp', () => {
    it('should sign up successfully', async () => {
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const response = await act(async () => {
        return await result.current.signUp('new@example.com', 'password123')
      })

      expect(response).toEqual({ error: undefined })
      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
      })
    })

    it('should handle sign up error', async () => {
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already exists' },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const response = await act(async () => {
        return await result.current.signUp('existing@example.com', 'password')
      })

      expect(response).toEqual({ error: 'Email already exists' })
    })
  })

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSupabaseAuth.signOut).toHaveBeenCalledTimes(1)
    })

    it('should handle sign out error gracefully', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({
        error: { message: 'Sign out failed' },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Should not throw even if sign out fails
      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSupabaseAuth.signOut).toHaveBeenCalledTimes(1)
    })
  })

  describe('Provider integration', () => {
    it('should provide auth context to children', async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      })

      const TestComponent = () => {
        const { user, loading } = useAuth()
        return (
          <div>
            <span data-testid="loading">{String(loading)}</span>
            <span data-testid="user-email">{user?.email || 'none'}</span>
          </div>
        )
      }

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('true')

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
        expect(screen.getByTestId('user-email')).toHaveTextContent(
          'test@example.com',
        )
      })
    })

    it('should share auth state between multiple consumers', async () => {
      let authChangeCallback: (event: any, session: any) => void

      mockSupabaseAuth.onAuthStateChange.mockImplementation((callback) => {
        authChangeCallback = callback
        return {
          data: {
            subscription: { unsubscribe: jest.fn() },
          },
        }
      })

      const Consumer1 = () => {
        const { user } = useAuth()
        return <span data-testid="consumer1">{user?.id || 'none'}</span>
      }

      const Consumer2 = () => {
        const { user } = useAuth()
        return <span data-testid="consumer2">{user?.email || 'none'}</span>
      }

      render(
        <AuthProvider>
          <Consumer1 />
          <Consumer2 />
        </AuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('consumer1')).toHaveTextContent('none')
        expect(screen.getByTestId('consumer2')).toHaveTextContent('none')
      })

      // Simulate user login
      act(() => {
        authChangeCallback!('SIGNED_IN', mockSession)
      })

      expect(screen.getByTestId('consumer1')).toHaveTextContent('user123')
      expect(screen.getByTestId('consumer2')).toHaveTextContent(
        'test@example.com',
      )
    })
  })

  describe('error scenarios', () => {
    it('should handle getSession error gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      const networkError = new Error('Network error')
      mockSupabaseAuth.getSession.mockRejectedValue(networkError)

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Should still initialize even with error
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(consoleError).toHaveBeenCalledWith(
        'Error getting session:',
        networkError,
      )

      consoleError.mockRestore()
    })
  })
})
