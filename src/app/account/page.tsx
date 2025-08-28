'use client'

import { useEffect } from 'react'

import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/Button'
import { Stack } from '@/components/ui/Layout'
import { useAuth } from '@/contexts/AuthContext'
import {
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/styles/designTokens'

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing[4]};
  background: linear-gradient(
    180deg,
    ${colors.gray[50]} 0%,
    ${colors.white} 100%
  );
`

const AccountCard = styled.div`
  background: ${colors.white};
  border-radius: ${borderRadius.xl};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  padding: ${spacing[8]};
`

const Title = styled.h1`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.black};
  margin-bottom: ${spacing[6]};
  text-align: center;
`

const InfoSection = styled.div`
  background: ${colors.gray[50]};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[4]};
  margin-bottom: ${spacing[6]};
`

const Label = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[600]};
  margin-bottom: ${spacing[1]};
  font-weight: ${typography.fontWeight.medium};
`

const Value = styled.div`
  font-size: ${typography.fontSize.base};
  color: ${colors.black};
  word-break: break-word;
`

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <PageContainer>
        <AccountCard>
          <Title>Loading...</Title>
        </AccountCard>
      </PageContainer>
    )
  }

  if (!user) {
    return null
  }

  return (
    <PageContainer>
      <AccountCard>
        <Title>My Account</Title>

        <InfoSection>
          <Label>Email Address</Label>
          <Value>{user.email}</Value>
        </InfoSection>

        <Stack gap={3}>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
          <Button fullWidth variant="primary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Stack>
      </AccountCard>
    </PageContainer>
  )
}
