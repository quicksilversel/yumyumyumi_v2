'use client'

import React, { useState } from 'react'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { useServerInsertedHTML } from 'next/navigation'

// This component handles Emotion's SSR for App Router
export default function EmotionRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [cache] = useState(() => {
    const cache = createCache({ 
      key: 'css',
      prepend: true,
    })
    cache.compat = true
    return cache
  })

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}