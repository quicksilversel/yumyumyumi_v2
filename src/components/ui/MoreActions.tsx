import { useState, useRef, useEffect } from 'react'

import styled from '@emotion/styled'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { IconButton } from '@/components/ui/Button'

interface MoreActionsProps {
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
  className?: string
}

export const MoreActions = ({
  onEdit,
  onDelete,
  isDeleting = false,
  className,
}: MoreActionsProps) => {
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

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(!menuOpen)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(false)
    onEdit()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(false)
    onDelete()
  }

  return (
    <Container className={className}>
      <StyledIconButton
        onClick={handleMenuToggle}
        size="sm"
        disabled={isDeleting}
        type="button"
      >
        <MoreVertIcon fontSize="inherit" />
      </StyledIconButton>
      <Menu open={menuOpen} ref={menuRef}>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="inherit" />
          <span>編集する</span>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="inherit" />
          <span>削除する</span>
        </MenuItem>
      </Menu>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`

const StyledIconButton = styled(IconButton)`
  background-color: rgb(255, 255, 255, 90%);
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgb(255, 255, 255, 95%);
  }
`

const Menu = styled.div<{ open: boolean }>`
  position: absolute;
  top: 38px;
  right: 0;
  z-index: 1000;
  display: ${({ open }) => (open ? 'block' : 'none')};
  min-width: 140px;
  margin-top: ${({ theme }) => theme.spacing[1]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: left;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  svg {
    font-size: 18px;
  }
`
