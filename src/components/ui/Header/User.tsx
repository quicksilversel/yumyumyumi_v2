'use client'

import { useState, useRef } from 'react'

import styled from '@emotion/styled'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import Link from 'next/link'

import { Divider } from '@/components/ui/Layout'
import { useAuth } from '@/contexts/AuthContext'

export const User = () => {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

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
        <PersonIcon />
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
          Sign Out
        </MenuItem>
      </DropdownMenu>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`

const DropdownMenu = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing[6]});
  right: 50%;
  transform: translateX(50%);
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  min-width: 200px;
  z-index: 1000;
  display: ${({ open }) => (open ? 'block' : 'none')};
  overflow: hidden;
`

const UserLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
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
  background: none;
  border: none;
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
