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
          <MenuTitle>Filters</MenuTitle>
          <CloseButton size="sm" onClick={() => setSlideMenuOpen(false)}>
            <CloseIcon />
          </CloseButton>
        </MenuHeader>
        <MenuContent>
          <Menu />
        </MenuContent>
      </SlideMenu>
    </>
  )
}

const Container = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding-inline: 1rem;
`

const Toolbar = styled(Flex)`
  height: 56px;
  width: 100%;
  max-width: 1000px;
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
  z-index: 998;
  display: ${({ open }) => (open ? 'block' : 'none')};
  background-color: rgb(0, 0, 0, 50%);
  animation: ${({ open }) => (open ? `${fadeIn} 0.3s ease` : 'none')};
  inset: 0;
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
  transition: transform 0.3s ease;
  transform: translateX(${({ open }) => (open ? '0' : '100%')});
  box-shadow: -4px 0 20px rgb(0, 0, 0, 15%);

  @media (width <= 480px) {
    width: 85%;
    max-width: 320px;
  }
`

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const MenuTitle = styled.span`
  margin: 0;
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`

const CloseButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.gray[600]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`

const MenuContent = styled.div`
  flex: 1;
  overflow-y: auto;
`
