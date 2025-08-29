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

const AccountCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: ${spacing[8]};
  border-radius: ${borderRadius.xl};
  background: ${colors.white};
  box-shadow: 0 10px 25px rgb(0, 0, 0, 10%);
`

const Title = styled.h1`
  margin-bottom: ${spacing[6]};
  color: ${colors.black};
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  text-align: center;
`

const InfoSection = styled.div`
  margin-bottom: ${spacing[6]};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.lg};
  background: ${colors.gray[50]};
`

const Label = styled.div`
  margin-bottom: ${spacing[1]};
  color: ${colors.gray[600]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
`

const Value = styled.div`
  color: ${colors.black};
  font-size: ${typography.fontSize.base};
  word-break: break-all;
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
