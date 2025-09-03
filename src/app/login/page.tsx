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
import {
  colors,
  spacing,
  borderRadius,
  transition,
  typography,
} from '@/styles/designTokens'

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${spacing[4]};
  background: linear-gradient(
    180deg,
    ${colors.gray[50]} 0%,
    ${colors.white} 100%
  );
`

const AuthCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: ${spacing[8]};
  border-radius: ${borderRadius.xl};
  background: ${colors.white};
  box-shadow: 0 10px 25px rgb(0, 0, 0, 10%);
`

const TabContainer = styled.div`
  display: flex;
  margin-bottom: ${spacing[6]};
  border-bottom: 1px solid ${colors.gray[200]};
`

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${spacing[3]} ${spacing[4]};
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${(props) => (props.active ? colors.black : colors.gray[500])};
  transition: all ${transition.default};

  ${(props) =>
    props.active &&
    css`
      border-bottom-color: ${colors.black};
    `}

  &:hover:not(:disabled) {
    color: ${colors.black};
  }
`

const Alert = styled.div<{ variant: 'error' | 'success' }>`
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing[4]};
  font-size: ${typography.fontSize.sm};

  ${(props) =>
    props.variant === 'error'
      ? css`
          background-color: ${colors.error};
          color: ${colors.white};
        `
      : css`
          background-color: ${colors.success};
          color: ${colors.white};
        `}
`

const InputWrapper = styled.div`
  position: relative;
`

const PasswordToggle = styled(IconButton)`
  position: absolute;
  top: 50%;
  right: ${spacing[2]};
  transform: translateY(-50%);
`

const Form = styled.form`
  width: 100%;
`

const LinkButton = styled.button`
  margin-left: ${spacing[1]};
  padding: 0;
  border: none;
  background: none;
  color: ${colors.black};
  font-size: inherit;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`

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
                style={{ paddingRight: spacing[10] }}
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
