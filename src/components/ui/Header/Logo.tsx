import styled from '@emotion/styled'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import Link from 'next/link'

export const Logo = () => {
  return (
    <LogoLink href="/">
      <RestaurantMenuIcon />
      <LogoText>YumYumYumi</LogoText>
    </LogoLink>
  )
}

const LogoLink = styled(Link)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
`

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 0.1em;
`
