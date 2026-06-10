'use client'

import { createContext, useContext, useMemo } from 'react'

import {
  signIn as nextSignIn,
  signOut as nextSignOut,
  useSession,
} from 'next-auth/react'

type AuthUser = {
  id: string
  email?: string | null
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const value = useMemo<AuthContextType>(() => {
    const user = session?.user
      ? { id: session.user.id, email: session.user.email }
      : null

    return {
      user,
      loading: status === 'loading',
      signIn: async (email: string, password: string) => {
        const result = await nextSignIn('credentials', {
          email,
          password,
          redirect: false,
        })
        if (result?.error) {
          return { error: 'メールアドレスまたはパスワードが正しくありません' }
        }
        return {}
      },
      signOut: async () => {
        await nextSignOut({ redirect: false })
      },
    }
  }, [session, status])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
