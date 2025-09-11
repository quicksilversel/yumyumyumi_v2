'use client'

import { useState, useEffect } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useRouter } from 'next/navigation'

import { Spinner, Input, Button, IconButton } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [tab, setTab] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const { signIn, signUp, user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/account')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (tab === 0) {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error)
        } else {
          router.push('/')
        }
      } else {
        if (password !== confirmPassword) {
          setError('パスワードが一致しません')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('パスワードは6文字以上で入力してください')
          setLoading(false)
          return
        }

        const { error } = await signUp(email, password)
        if (error) {
          setError(error)
        } else {
          setSuccess('メールアドレスに確認メールを送信しました！')
          setTimeout(() => {
            router.push('/')
          }, 3000)
        }
      }
    } catch (err) {
      setError('予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (newValue: number) => {
    setTab(newValue)
    setError('')
    setSuccess('')
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
          <TabList role="tablist" aria-label="認証方法を選択">
            <TabButton
              role="tab"
              aria-selected={tab === 0}
              aria-controls="login-panel"
              id="login-tab"
              active={tab === 0}
              onClick={() => handleTabChange(0)}
              type="button"
            >
              ログイン
            </TabButton>
            <TabButton
              role="tab"
              aria-selected={tab === 1}
              aria-controls="signup-panel"
              id="signup-tab"
              active={tab === 1}
              onClick={() => handleTabChange(1)}
              type="button"
            >
              新規会員登録
            </TabButton>
          </TabList>
        </AuthHeader>
        <AuthForm
          id={tab === 0 ? 'login-panel' : 'signup-panel'}
          role="tabpanel"
          aria-labelledby={tab === 0 ? 'login-tab' : 'signup-tab'}
          onSubmit={handleSubmit}
        >
          {error && (
            <Alert variant="error" role="alert" aria-live="polite">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" role="alert" aria-live="polite">
              {success}
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
              aria-describedby="email-help"
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
                autoComplete={tab === 0 ? 'current-password' : 'new-password'}
                aria-describedby={tab === 1 ? 'password-help' : undefined}
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
            {tab === 1 && (
              <>
                <HelpText id="password-help">
                  パスワードは6文字以上で設定してください
                </HelpText>
                <Input
                  id="confirmPassword"
                  title="確認用のパスワード"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  height="medium"
                  aria-describedby="confirm-password-help"
                />
                <HelpText id="confirm-password-help">
                  上記と同じパスワードを入力してください
                </HelpText>
              </>
            )}
          </FieldGroup>
          <SubmitButton
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            aria-describedby="submit-help"
          >
            {loading
              ? '読み込み中...'
              : tab === 0
                ? 'ログインする'
                : '登録する'}
          </SubmitButton>
          <AuthFooter>
            <FooterText>
              {tab === 0 ? (
                <>
                  はじめてご利用の方は
                  <SwitchAuthButton
                    type="button"
                    onClick={() => setTab(1)}
                    aria-label="新規会員登録に切り替え"
                  >
                    新規会員登録
                  </SwitchAuthButton>
                </>
              ) : (
                <>
                  すでに会員の方は
                  <SwitchAuthButton
                    type="button"
                    onClick={() => setTab(0)}
                    aria-label="ログインに切り替え"
                  >
                    ログイン
                  </SwitchAuthButton>
                </>
              )}
            </FooterText>
          </AuthFooter>
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

const TabList = styled.div`
  display: flex;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md}
    ${({ theme }) => theme.borderRadius.md} 0 0;
`

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, active }) =>
    active ? theme.colors.black : theme.colors.gray[500]};
  cursor: pointer;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all ${({ theme }) => theme.transition.default};

  ${({ theme, active }) =>
    active &&
    css`
      color: ${theme.colors.black};
      border-bottom-color: ${theme.colors.primary};
    `}

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
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

const HelpText = styled.p`
  margin: ${({ theme }) => theme.spacing[1]} 0 0 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.gray[600]};
`

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing[2]};
`

const AuthFooter = styled.footer`
  padding-top: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const FooterText = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
`

const SwitchAuthButton = styled.button`
  margin-left: ${({ theme }) => theme.spacing[1]};
  font-size: inherit;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  transition: opacity ${({ theme }) => theme.transition.default};

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
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
