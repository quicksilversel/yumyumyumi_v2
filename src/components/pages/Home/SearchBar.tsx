import styled from '@emotion/styled'

type Props = {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export const SearchBar = ({ searchTerm, onSearchChange }: Props) => {
  return (
    <Container>
      <SearchInput
        id="search-input"
        type="text"
        placeholder="料理名・食材でレシピを探す"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin: ${({ theme }) => theme.spacing[6]} auto;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 24px;
  border: 1px solid #575756;
  border-radius: 50px;
  background-color: transparent;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
  background-position: 98% center;
  background-size: 18px 18px;
  color: #575756;
  font-size: 14px;
  line-height: 18px;
  transition: transform 250ms ease-in-out;
  transition: all 250ms ease-in-out;
  background-repeat: no-repeat;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  &::placeholder {
    color: #575756;
    opacity: 0.7;
  }

  &:hover,
  &:focus {
    padding: 12px 0;
    border: 1px solid transparent;
    border-radius: 0;
    background-position: 100% center;
    border-bottom: 1px solid #575756;
    outline: 0;
  }
`
