'use client'

import { useState, useRef, useEffect } from 'react'

import styled from '@emotion/styled'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AddIcon from '@mui/icons-material/Add'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Container, Flex, Spacer, Divider } from '@/components/ui/Layout'
import { useAuth } from '@/contexts/AuthContext'

import { SearchAndFilters } from './SearchAndFilters'
import { AddRecipeDialog } from './ui/Modals/AddRecipeDialog'
import { AuthModal } from './ui/Modals/AuthModal'

export function AppHeader() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [addRecipeOpen, setAddRecipeOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen)
  }

  const handleMenuClose = () => {
    setMenuOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    handleMenuClose()
  }

  const handleAddRecipe = () => {
    if (!user) {
      setAuthModalOpen(true)
    } else {
      setAddRecipeOpen(true)
    }
  }

  return (
    <>
      <Header>
        <HeaderContent>
          <Container maxWidth="lg" noPadding>
            <Toolbar align="center">
              <LogoLink href="/">
                <RestaurantMenuIcon />
                <LogoText>YumYumYumi</LogoText>
              </LogoLink>

              <Spacer />

              <Flex gap={4} align="center">
                <AddButton
                  variant="secondary"
                  size="md"
                  onClick={handleAddRecipe}
                >
                  <AddIcon />
                </AddButton>

                {user ? (
                  <div style={{ position: 'relative' }} ref={menuRef}>
                    <Avatar onClick={handleMenuToggle}>
                      {user.email?.charAt(0).toUpperCase()}
                    </Avatar>
                    <DropdownMenu open={menuOpen}>
                      <MenuItem disabled>
                        <AccountCircleIcon />
                        {user.email}
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem onClick={handleSignOut}>
                        <LogoutIcon />
                        Sign Out
                      </MenuItem>
                    </DropdownMenu>
                  </div>
                ) : (
                  <SignInButton
                    variant="secondary"
                    size="md"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    <LoginIcon />
                    Sign In
                  </SignInButton>
                )}
              </Flex>
            </Toolbar>
          </Container>

          <FilterBar>
            <Container maxWidth="lg">
              <SearchAndFilters />
            </Container>
          </FilterBar>
        </HeaderContent>
      </Header>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <AddRecipeDialog
        open={addRecipeOpen}
        onClose={() => setAddRecipeOpen(false)}
        onRecipeAdded={() => {
          window.location.reload()
        }}
      />
    </>
  )
}

const Header = styled.header`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`

const FilterBar = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  padding: ${({ theme }) => theme.spacing[3]} 0;
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const Toolbar = styled(Flex)`
  height: 64px;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.white};
  transition: opacity ${({ theme }) => theme.transition.default};

  &:hover {
    opacity: 0.8;
  }
`

const LogoText = styled.div`
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: 0.1em;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

const AddButton = styled(Button)`
  color: ${({ theme }) => theme.colors.black};
  padding: 0 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
`

const SignInButton = styled(Button)`
  border-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: ${({ theme }) => theme.colors.white};
  }
`

const Avatar = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: opacity ${({ theme }) => theme.transition.default};

  &:hover {
    opacity: 0.8;
  }
`

const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing[2]});
  right: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  min-width: 200px;
  z-index: 1000;
  display: ${({ open }) => (open ? 'block' : 'none')};
  overflow: hidden;
`

const MenuItem = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  font-size: 14px;
  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.gray[500] : theme.colors.black};
  text-align: left;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  svg {
    font-size: 18px;
  }
`

const MenuDivider = styled(Divider)`
  margin: 0;
`
