import styled from '@emotion/styled'
import Image from 'next/image'

import { pickRecipeIcon } from '@/lib/recipeIcons'

type Props = {
  src?: string | null
  alt: string
  seed?: string
  sizes?: string
  priority?: boolean
}

export const RecipeImage = ({ src, alt, seed, sizes, priority }: Props) => {
  if (!src) {
    return (
      <Placeholder aria-hidden="true">
        <Image
          src={pickRecipeIcon(seed ?? alt)}
          alt=""
          width={56}
          height={56}
        />
      </Placeholder>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      style={{ objectFit: 'cover' }}
    />
  )
}

const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}1f 0%,
    ${({ theme }) => theme.colors.gray[100]} 100%
  );

  img {
    opacity: 0.8;
  }
`
