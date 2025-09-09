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
        <UserLink href="/account">
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
  position: relative;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`

const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing[6]});
  right: 50%;
  z-index: 1000;
  display: ${({ open }) => (open ? 'block' : 'none')};
  min-width: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.white};
  transform: translateX(50%);
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.xl};
`

const UserLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.black};
  text-align: left;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.black};
  text-align: left;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`

const MenuDivider = styled(Divider)`
  margin: 0;
`
