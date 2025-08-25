'use client'

import Link from 'next/link'

import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'

export function AppHeader() {
  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <RestaurantMenuIcon sx={{ mr: 1.5, fontSize: 32 }} />
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              YumYumYumi
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </Container>
    </AppBar>
  )
}