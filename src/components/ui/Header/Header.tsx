'use client'

import { useState } from 'react'

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
        <InnerContainer>
          <Toolbar align="center" justify="between">
            <Logo />
            <Flex gap={4} align="center">
              <User />
              {user && <AddRecipeButton />}
              <BurgerButton onClick={() => setSlideMenuOpen(true)}>
                <MenuIcon />
              </BurgerButton>
            </Flex>
          </Toolbar>
        </InnerContainer>
      </Container>
      <MenuOverlay
        open={slideMenuOpen}
        onClick={() => setSlideMenuOpen(false)}
      />
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
  padding-inline: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const InnerContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
`

const Toolbar = styled(Flex)`
  height: 56px;
`

const BurgerButton = styled.button``

const MenuOverlay = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: ${({ open }) => (open ? 'block' : 'none')};
  animation: ${({ open }) => (open ? 'fadeIn 0.3s ease' : 'none')};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const SlideMenu = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transform: translateX(${({ open }) => (open ? '0' : '100%')});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
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

const MenuTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.black};
  margin: 0;
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
  padding: ${({ theme }) => theme.spacing[4]};
`
