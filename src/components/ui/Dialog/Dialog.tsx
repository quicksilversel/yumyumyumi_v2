import { ReactNode, useEffect } from 'react'

import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'

import { IconButton } from '../Button'

export type DialogProps = {
  open: boolean
  onClose: () => void
  title?: string | ReactNode
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  actions?: ReactNode
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  maxWidth,
  actions,
}: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <DialogOverlay open={open} onClick={onClose}>
      <DialogContent maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <IconButton onClick={onClose} size="sm">
              <CloseIcon />
            </IconButton>
          </DialogHeader>
        )}
        <DialogBody>{children}</DialogBody>
        {actions && <DialogActions>{actions}</DialogActions>}
      </DialogContent>
    </DialogOverlay>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

export const DialogOverlay = styled.div<{
  open?: boolean
}>`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: ${({ open }) => (open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: rgb(0, 0, 0, 30%);
  animation: ${fadeIn} ${({ theme }) => theme.transition.fast};
`

export const DialogContent = styled.div<{
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}>`
  position: relative;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  animation: ${slideUp} ${({ theme }) => theme.transition.default};

  ${({ maxWidth }) => {
    const widths = {
      sm: '400px',
      md: '600px',
      lg: '800px',
      xl: '1000px',
    }
    return css`
      max-width: ${widths[maxWidth || 'md']};
    `
  }}
`

export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

export const DialogTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.black};
`

export const DialogBody = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`

export const DialogActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing[6]};
  padding-top: 0;
`
