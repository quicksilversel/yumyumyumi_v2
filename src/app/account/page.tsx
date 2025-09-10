'use client'

import { useEffect } from 'react'

import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'

import { Button, Stack, Spinner } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

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
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      </PageContainer>
    )
  }

  if (!user) {
    return null
  }

  return (
    <PageContainer>
      <AccountCard>
        <Title>マイページ</Title>
        <InfoSection>
          <Label>メールアドレス</Label>
          <Value>{user.email}</Value>
        </InfoSection>

        <Stack gap={3}>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => router.push('/')}
          >
            サイトトップへ戻る
          </Button>
          <Button fullWidth variant="primary" onClick={handleSignOut}>
            ログアウト
          </Button>
        </Stack>
      </AccountCard>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  min-height: 50vh;
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
  margin-inline: auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 10px 25px rgb(0, 0, 0, 10%);
`

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
`

const InfoSection = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

const Label = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
`

const Value = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.black};
  word-break: break-all;
`

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`
