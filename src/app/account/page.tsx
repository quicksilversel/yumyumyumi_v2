'use client'

import { useEffect } from 'react'

import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'

import { Button, Spinner } from '@/components/ui'
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
      <AccountMain>
        <AccountHeader>
          <Avatar aria-hidden="true">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <WelcomeText>
            <Greeting>おかえりなさい</Greeting>
            <UserEmail>{user.email}</UserEmail>
          </WelcomeText>
        </AccountHeader>

        <AccountContent>
          <AccountSection aria-labelledby="account-info-heading">
            <SectionTitle id="account-info-heading">
              アカウント情報
            </SectionTitle>
            <InfoCard>
              <InfoItem>
                <InfoLabel>メールアドレス</InfoLabel>
                <InfoValue>{user.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>アカウント作成日</InfoLabel>
                <InfoValue>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString('ja-JP')
                    : '不明'}
                </InfoValue>
              </InfoItem>
            </InfoCard>
          </AccountSection>
          <ActionsSection aria-labelledby="actions-heading">
            <SectionTitle id="actions-heading">アクション</SectionTitle>
            <ActionGrid>
              <ActionButton
                variant="secondary"
                onClick={() => router.push('/')}
                aria-label="ホームページに戻る"
              >
                <ActionIcon>🏠</ActionIcon>
                <ActionText>
                  <ActionTitle>ホーム</ActionTitle>
                  <ActionSubtitle>レシピを見る</ActionSubtitle>
                </ActionText>
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => router.push('/recipes/new')}
                aria-label="新しいレシピを作成"
              >
                <ActionIcon>✨</ActionIcon>
                <ActionText>
                  <ActionTitle>レシピ作成</ActionTitle>
                  <ActionSubtitle>新しいレシピを追加</ActionSubtitle>
                </ActionText>
              </ActionButton>
            </ActionGrid>
          </ActionsSection>
        </AccountContent>

        <AccountFooter>
          <SignOutButton
            variant="ghost"
            onClick={handleSignOut}
            aria-label="アカウントからログアウト"
          >
            ログアウト
          </SignOutButton>
        </AccountFooter>
      </AccountMain>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.gray[50]} 0%,
    ${({ theme }) => theme.colors.white} 100%
  );
`

const AccountMain = styled.main`
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow:
    0 4px 6px -1px rgb(0, 0, 0, 0.05),
    0 2px 4px -1px rgb(0, 0, 0, 0.03);
`

const AccountHeader = styled.header`
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[6]};
  text-align: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}10 0%,
    ${({ theme }) => theme.colors.primary}05 100%
  );
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
`

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
  font-size: 28px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.white};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.primary}80 100%
  );
  border-radius: 50%;
  box-shadow: 0 4px 12px rgb(0, 0, 0, 0.15);
`

const WelcomeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`

const Greeting = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  letter-spacing: -0.025em;
`

const UserEmail = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
`

const AccountContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
`

const AccountSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  letter-spacing: -0.025em;
`

const InfoCard = styled.div`
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

const InfoItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }
`

const InfoLabel = styled.dt`
  flex-shrink: 0;
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
`

const InfoValue = styled.dd`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  text-align: right;
  word-break: break-all;
`

const ActionsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const ActionButton = styled(Button)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  height: auto;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.gray[300]};
    box-shadow: 0 4px 12px rgb(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

const ActionIcon = styled.div`
  font-size: 24px;
  line-height: 1;
`

const ActionText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[0.5]};
  text-align: center;
`

const ActionTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`

const ActionSubtitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
`

const AccountFooter = styled.footer`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  text-align: center;
  background: ${({ theme }) => theme.colors.gray[50]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const SignOutButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.gray[900]};
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`
