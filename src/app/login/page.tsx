'use client'

import { useState, useEffect } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useRouter } from 'next/navigation'

import { Button, IconButton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Forms/Input'
import { Stack } from '@/components/ui/Layout'
import { Caption } from '@/components/ui/Typography'
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
      router.push('/')
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
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }

        const { error } = await signUp(email, password)
        if (error) {
          setError(error)
        } else {
          setSuccess('Check your email to confirm your account!')
          setTimeout(() => {
            router.push('/')
          }, 3000)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
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
        <AuthCard>
          <TabContainer>
            <Tab active type="button">
              Loading...
            </Tab>
          </TabContainer>
        </AuthCard>
      </PageContainer>
    )
  }

  if (user) {
    return null
  }

  return (
    <PageContainer>
      <AuthCard>
        <TabContainer>
          <Tab
            active={tab === 0}
            onClick={() => handleTabChange(0)}
            type="button"
          >
            Sign In
          </Tab>
          <Tab
            active={tab === 1}
            onClick={() => handleTabChange(1)}
            type="button"
          >
            Sign Up
          </Tab>
        </TabContainer>

        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="error">{error}</Alert>}

          {success && <Alert variant="success">{success}</Alert>}

          <Stack gap={4}>
            <Input
              id="email"
              title="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />

            <InputWrapper>
              <Input
                id="password"
                title="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete={tab === 0 ? 'current-password' : 'new-password'}
              />
              <PasswordToggle
                onClick={() => setShowPassword(!showPassword)}
                size="sm"
                type="button"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </PasswordToggle>
            </InputWrapper>

            {tab === 1 && (
              <Input
                id="confirmPassword"
                title="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Please wait...' : tab === 0 ? 'Sign In' : 'Sign Up'}
            </Button>

            <Caption style={{ textAlign: 'center' }}>
              {tab === 0 ? (
                <>
                  Don&apos;t have an account?
                  <LinkButton type="button" onClick={() => setTab(1)}>
                    Sign Up
                  </LinkButton>
                </>
              ) : (
                <>
                  Already have an account?
                  <LinkButton type="button" onClick={() => setTab(0)}>
                    Sign In
                  </LinkButton>
                </>
              )}
            </Caption>
          </Stack>
        </Form>
      </AuthCard>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.gray[50]} 0%,
    ${({ theme }) => theme.colors.white} 100%
  );
`

const AuthCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 10px 25px rgb(0, 0, 0, 10%);
`

const TabContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, active }) =>
    active ? theme.colors.black : theme.colors.gray[500]};
  transition: color ${({ theme }) => theme.transition.default};

  ${({ theme, active }) =>
    active &&
    css`
      border-bottom-color: ${theme.colors.black};
    `}

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.black};
  }
`

const Alert = styled.div<{ variant: 'error' | 'success' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  ${({ theme, variant }) =>
    variant === 'error'
      ? css`
          background-color: ${theme.colors.error};
          color: ${theme.colors.white};
        `
      : css`
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
        `}
`

const InputWrapper = styled.div`
  position: relative;
`

const PasswordToggle = styled(IconButton)`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.spacing[2]};
  transform: translateY(-50%);
`

const Form = styled.form`
  width: 100%;
`

const LinkButton = styled.button`
  margin-left: ${({ theme }) => theme.spacing[1]};
  padding: 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.black};
  font-size: inherit;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`
