import { ReactNode } from 'react'

import { renderHook, act } from '@testing-library/react'
import { signIn, signOut, useSession } from 'next-auth/react'

import { AuthProvider, useAuth } from './AuthContext'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: ReactNode }) => children,
}))

const mockUseSession = useSession as jest.Mock
const mockSignIn = signIn as jest.Mock
const mockSignOut = signOut as jest.Mock

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })
  })

  describe('useAuth', () => {
    it('should throw error when used outside AuthProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within an AuthProvider')

      consoleError.mockRestore()
    })

    it('should expose a null user when unauthenticated', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.user).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it('should reflect the loading status', () => {
      mockUseSession.mockReturnValue({ data: null, status: 'loading' })

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.loading).toBe(true)
    })

    it('should map the session to a user', () => {
      mockUseSession.mockReturnValue({
        data: { user: { id: 'user123', email: 'test@example.com' } },
        status: 'authenticated',
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.user).toEqual({
        id: 'user123',
        email: 'test@example.com',
      })
    })
  })

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      mockSignIn.mockResolvedValue({ ok: true, error: null })

      const { result } = renderHook(() => useAuth(), { wrapper })

      let response
      await act(async () => {
        response = await result.current.signIn(
          'test@example.com',
          'password123',
        )
      })

      expect(response).toEqual({})
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    it('should return an error message on failure', async () => {
      mockSignIn.mockResolvedValue({ error: 'CredentialsSignin' })

      const { result } = renderHook(() => useAuth(), { wrapper })

      let response
      await act(async () => {
        response = await result.current.signIn('test@example.com', 'wrong')
      })

      expect(response).toEqual({
        error: 'メールアドレスまたはパスワードが正しくありません',
      })
    })
  })

  describe('signOut', () => {
    it('should call next-auth signOut', async () => {
      mockSignOut.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSignOut).toHaveBeenCalledWith({ redirect: false })
    })
  })
})
