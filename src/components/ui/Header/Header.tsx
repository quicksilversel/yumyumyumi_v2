'use client'

import { useState } from 'react'

import { keyframes } from '@emotion/css'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'

import { Flex, IconButton } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

import { AddRecipeButton } from './AddRecipeButton'
import { Logo } from './Logo'
import { Menu } from './Menu'
import { User } from './User'

export const Header = () => {
  const { user } = useAuth()
  const [slideMenuOpen, setSlideMenuOpen] = useState(false)

  return (
    <>
      <Container>
        <Toolbar align="center" justify="between">
          <Logo />
          <Flex gap={4} align="center">
            <User />
            {user && <AddRecipeButton />}
            <button onClick={() => setSlideMenuOpen(true)}>
              <MenuIcon />
            </button>
          </Flex>
        </Toolbar>
      </Container>
      {slideMenuOpen && (
        <MenuOverlay
          open={slideMenuOpen}
          onClick={() => setSlideMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <SlideMenu open={slideMenuOpen}>
        <MenuHeader>
          <MenuTitle>絞り込み</MenuTitle>
          <IconButton size="sm" onClick={() => setSlideMenuOpen(false)}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </MenuHeader>
        <MenuContent>
          <Menu setSlideMenuOpen={setSlideMenuOpen} />
        </MenuContent>
      </SlideMenu>
    </>
  )
}

const Container = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  padding-inline: 1rem;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const Toolbar = styled(Flex)`
  width: 100%;
  max-width: 1200px;
  height: 56px;
  margin: 0 auto;
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const MenuOverlay = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 998;
  display: ${({ open }) => (open ? 'block' : 'none')};
  background-color: rgb(0, 0, 0, 50%);
  animation: ${({ open }) => (open ? `${fadeIn} 0.3s ease` : 'none')};
`

const SlideMenu = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  width: 320px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: -4px 0 20px rgb(0, 0, 0, 15%);
  transform: translateX(${({ open }) => (open ? '0' : '100%')});
  transition: transform 0.3s ease;

  @media (width <= 480px) {
    width: 85%;
    max-width: 320px;
  }
`

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const MenuTitle = styled.span`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.black};
`

const MenuContent = styled.div`
  flex: 1;
  overflow-y: auto;
`
