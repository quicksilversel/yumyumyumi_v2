'use client'

import { useState } from 'react'

import styled from '@emotion/styled'
import { X as CloseIcon, Menu as MenuIcon } from 'lucide-react'

import { Flex, IconButton } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useHydrated } from '@/hooks/useHydrated'

import { AddRecipeButton } from './AddRecipeButton'
import { Logo } from './Logo'
import { Menu } from './Menu'
import { User } from './User'

export const Header = () => {
  const { user, loading } = useAuth()
  const [slideMenuOpen, setSlideMenuOpen] = useState(false)
  const mounted = useHydrated()

  return (
    <>
      <Container>
        <Toolbar align="center" justify="between">
          <Logo />
          <Flex gap={4} align="center">
            <User />
            {mounted && !loading && user && <AddRecipeButton />}
            <button onClick={() => setSlideMenuOpen(true)} type="button">
              <MenuIcon />
            </button>
          </Flex>
        </Toolbar>
      </Container>
      <MenuOverlay
        open={slideMenuOpen}
        onClick={() => setSlideMenuOpen(false)}
        aria-hidden="true"
      />
      <SlideMenu open={slideMenuOpen} inert={!slideMenuOpen}>
        <MenuHeader>
          <MenuTitle>絞り込み</MenuTitle>
          <IconButton
            size="sm"
            onClick={() => setSlideMenuOpen(false)}
            type="button"
          >
            <CloseIcon size="1em" type="button" />
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

const MenuOverlay = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 998;
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  background-color: rgb(0, 0, 0, 50%);
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const SlideMenu = styled.aside<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  flex-direction: column;
  width: 320px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: -4px 0 20px rgb(0, 0, 0, 15%);
  transform: translateX(${({ open }) => (open ? '0' : '100%')});
  transition:
    transform 0.3s ease,
    visibility 0.3s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

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
