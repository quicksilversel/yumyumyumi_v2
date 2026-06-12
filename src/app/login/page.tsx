'use client'

import { useState, useEffect } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Eye as Visibility, EyeOff as VisibilityOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Spinner, Input, Button, IconButton } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/account')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error)
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <PageContainer>
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      </PageContainer>
    )
  }

  if (user) {
    return null
  }

  return (
    <PageContainer>
      <AuthCard>
        <AuthHeader>
          <Title>ログイン</Title>
        </AuthHeader>
        <AuthForm onSubmit={handleSubmit}>
          {error && (
            <Alert variant="error" role="alert" aria-live="polite">
              {error}
            </Alert>
          )}
          <FieldGroup>
            <Input
              id="email"
              title="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              height="medium"
            />
            <PasswordField>
              <Input
                id="password"
                title="パスワード"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                height="medium"
                autoComplete="current-password"
              />
              <PasswordToggle
                onClick={() => setShowPassword(!showPassword)}
                size="sm"
                type="button"
                aria-label={
                  showPassword ? 'パスワードを隠す' : 'パスワードを表示'
                }
                aria-pressed={showPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </PasswordToggle>
            </PasswordField>
          </FieldGroup>
          <SubmitButton
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
          >
            {loading ? '読み込み中...' : 'ログインする'}
          </SubmitButton>
        </AuthForm>
      </AuthCard>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.gray[50]} 0%,
    ${({ theme }) => theme.colors.white} 100%
  );
`

const AuthCard = styled.main`
  width: 100%;
  max-width: 420px;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 10px 25px rgb(0, 0, 0, 0.1);
`

const AuthHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
`

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  width: 100%;
`

const FieldGroup = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: 0;
  margin: 0;
  border: none;
`

const PasswordField = styled.div`
  position: relative;
  width: 100%;
`

const PasswordToggle = styled(IconButton)`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.spacing[2]};
  z-index: 1;
  transform: translateY(-50%);
`

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing[2]};
`

const Alert = styled.div<{ variant: 'error' | 'success' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  ${({ theme, variant }) =>
    variant === 'error'
      ? css`
          color: ${theme.colors.error};
          background-color: ${theme.colors.error}10;
          border-color: ${theme.colors.error}20;
        `
      : css`
          color: ${theme.colors.success || theme.colors.primary};
          background-color: ${theme.colors.success || theme.colors.primary}10;
          border-color: ${theme.colors.success || theme.colors.primary}20;
        `}
`

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`
