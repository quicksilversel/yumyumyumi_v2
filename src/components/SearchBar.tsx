'use client'

import { useState } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'

type SearchBarProps = {
  onSearch: (searchTerm: string) => void
  placeholder?: string
}

export function SearchBar({
  onSearch,
  placeholder = 'Search for recipes, ingredients...',
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <TextField
      fullWidth
      value={searchTerm}
      onChange={handleChange}
      placeholder={placeholder}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        sx: {
          borderRadius: 2,
          '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.1)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.2)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: 2,
          },
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.paper',
        },
      }}
    />
  )
}