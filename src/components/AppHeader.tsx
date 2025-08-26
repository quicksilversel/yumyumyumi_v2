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
import { H4 } from '@/components/ui/Typography'
import { useAuth } from '@/contexts/AuthContext'
import {
  colors,
  spacing,
  shadow,
  borderRadius,
  transition,
} from '@/styles/designTokens'

import { AddRecipeDialog } from './AddRecipeDialog'
import { AuthModal } from './AuthModal'

// Styled Components
const Header = styled.header`
  position: sticky;
  top: 0;
  background-color: #f5b2ac;
  color: ${colors.white};
  z-index: 100;
  box-shadow: ${shadow.sm};
`

const Toolbar = styled(Flex)`
  height: 64px;
  padding: 0 ${spacing[4]};
`

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  text-decoration: none;
  color: ${colors.white};
  transition: opacity ${transition.default};

  &:hover {
    opacity: 0.8;
  }
`

const LogoText = styled(H4)`
  color: ${colors.white};
  letter-spacing: 0.1em;
`

const AddButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.black};

  &:hover {
    background-color: ${colors.gray[100]};
  }
`

const SignInButton = styled(Button)`
  border-color: ${colors.white};
  color: ${colors.white};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: ${colors.white};
  }
`

const Avatar = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${colors.white};
  color: ${colors.black};
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: opacity ${transition.default};

  &:hover {
    opacity: 0.8;
  }
`

const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + ${spacing[2]});
  right: 0;
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadow.xl};
  min-width: 200px;
  z-index: 1000;
  display: ${(props) => (props.open ? 'block' : 'none')};
  overflow: hidden;
`

const MenuItem = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  width: 100%;
  padding: ${spacing[3]} ${spacing[4]};
  background: none;
  border: none;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  font-size: 14px;
  color: ${(props) => (props.disabled ? colors.gray[500] : colors.black)};
  text-align: left;
  transition: background-color ${transition.fast};

  &:hover:not(:disabled) {
    background-color: ${colors.gray[50]};
  }

  svg {
    font-size: 18px;
  }
`

const MenuDivider = styled(Divider)`
  margin: 0;
`

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
                Add Recipe
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
      </Header>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <AddRecipeDialog
        open={addRecipeOpen}
        onClose={() => setAddRecipeOpen(false)}
        onRecipeAdded={() => {
          // Optionally refresh the page or update the recipe list
          window.location.reload()
        }}
      />
    </>
  )
}
