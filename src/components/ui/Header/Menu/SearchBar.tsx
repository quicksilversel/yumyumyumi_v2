import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'

type Props = {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export const SearchBar = ({ searchTerm, setSearchTerm }: Props) => {
  const router = useRouter()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (searchTerm) params.set('search', searchTerm)

    const queryString = params.toString()
    router.push(`/?${queryString}`)
  }

  return (
    <Container>
      <SearchWrapper>
        <Form onSubmit={handleSearchSubmit}>
          <SearchInput
            id="search"
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
      </SearchWrapper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  background-color: transparent;

  @media (width <= 35.1875rem) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`

const SearchWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  max-width: 400px;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.white};
  transition: border-color ${({ theme }) => theme.transition.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgb(245, 178, 172, 10%);
  }
`

const Form = styled.form`
  flex: 1;
  height: 40px;
`

const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[800]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`

const SearchAndFiltersFallback = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  height: 40px;
`
