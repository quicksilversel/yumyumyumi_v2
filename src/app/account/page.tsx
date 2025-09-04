'use client'

import { useEffect } from 'react'

import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/Button'
import { Stack } from '@/components/ui/Layout'
import { useAuth } from '@/contexts/AuthContext'

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

const AccountCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 10px 25px rgb(0, 0, 0, 10%);
`

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
`

const InfoSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.gray[50]};
`

const Label = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

const Value = styled.div`
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
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
