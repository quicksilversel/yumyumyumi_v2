'use client'

import { useEffect } from 'react'

import styled from '@emotion/styled'
import { Heart, House, LogOut, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Spinner } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useBookmarksContext } from '@/contexts/BookmarksContext'

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const { bookmarks } = useBookmarksContext()
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
          <Greeting>おかえりなさい</Greeting>
          <UserEmail>{user.email}</UserEmail>
          <Tagline>今日はどんな料理を作りますか？</Tagline>
        </AccountHeader>

        <ActionList>
          <ActionRow
            onClick={() => router.push('/')}
            type="button"
            aria-label="ホームへ"
          >
            <House size={20} />
            <ActionText>
              <ActionTitle>ホーム</ActionTitle>
              <ActionSubtitle>レシピを見る</ActionSubtitle>
            </ActionText>
            <ChevronRight size={18} />
          </ActionRow>

          <ActionRow
            onClick={() => router.push('/?bookmarked=true')}
            type="button"
            aria-label="お気に入りのレシピへ"
          >
            <Heart size={20} />
            <ActionText>
              <ActionTitle>お気に入り</ActionTitle>
              <ActionSubtitle>保存したレシピ</ActionSubtitle>
            </ActionText>
            <Count>{bookmarks.length}</Count>
            <ChevronRight size={18} />
          </ActionRow>
        </ActionList>

        <AccountFooter>
          <SignOutButton
            onClick={handleSignOut}
            type="button"
            aria-label="アカウントからログアウト"
          >
            <LogOut size={16} />
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
  min-height: 80vh;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`

const AccountMain = styled.main`
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadow.md};
`

const AccountHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[10]}
    ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[8]};
  text-align: center;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.primary}14 0%,
    transparent 100%
  );
`

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: 28px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  box-shadow: 0 6px 16px ${({ theme }) => theme.colors.primary}55;
`

const Greeting = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`

const UserEmail = styled.p`
  margin: ${({ theme }) => theme.spacing[1]} 0 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`

const Tagline = styled.p`
  margin: ${({ theme }) => theme.spacing[4]} 0 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`

const ActionList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing[2]};
`

const ActionRow = styled.button`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color ${({ theme }) => theme.transition.default};

  svg:last-of-type {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`

const ActionText = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  text-align: left;
`

const ActionTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`

const ActionSubtitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`

const Count = styled.span`
  min-width: 24px;
  padding: ${({ theme }) => theme.spacing[0.5]}
    ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.primary}1a;
  border-radius: ${({ theme }) => theme.borderRadius.full};
`

const AccountFooter = styled.footer`
  padding: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[100]};
`

const SignOutButton = styled.button`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transition.default};

  &:hover {
    color: ${({ theme }) => theme.colors.error};
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`
