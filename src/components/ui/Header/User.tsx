import { useState, useRef, useEffect } from 'react'

import styled from '@emotion/styled'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import Link from 'next/link'

import { Divider } from '@/components/ui/Layout'
import { useAuth } from '@/contexts/AuthContext'

export const User = () => {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
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

  if (!user) {
    return (
      <Link href="/login">
        <LoginIcon />
      </Link>
    )
  }

  return (
    <Container ref={menuRef}>
      <button onClick={handleMenuToggle}>
        <PersonIcon />
      </button>
      <DropdownMenu open={menuOpen}>
        <UserLink href="/account" onClick={handleMenuClose}>
          <AccountCircleIcon />
          {user.email}
        </UserLink>
        <MenuDivider />
        <MenuItem onClick={handleSignOut}>
          <LogoutIcon />
          ログアウト
        </MenuItem>
      </DropdownMenu>
    </Container>
  )
}

const Container = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  @media (width > 35.1875rem) {
    position: relative;
  }
`

const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing[6]});
  right: ${({ theme }) => theme.spacing[3]};
  z-index: 1000;
  display: ${({ open }) => (open ? 'block' : 'none')};
  min-width: 200px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};

  @media (width > 35.1875rem) {
    right: 50%;
    transform: translateX(50%);
  }
`

const UserLink = styled(Link)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.black};
  text-align: left;
  background: none;
  border: none;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`

const MenuItem = styled.button`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.black};
  text-align: left;
  background: none;
  border: none;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`

const MenuDivider = styled(Divider)`
  margin: 0;
`
