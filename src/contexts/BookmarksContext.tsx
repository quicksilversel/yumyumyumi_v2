import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { useRouter } from 'next/navigation'

import type { Bookmark } from '@/types/bookmarks'

import { useAuth } from '@/contexts/AuthContext'
import {
  getBookmarks,
  getBookmarkedRecipeIds,
  toggleBookmark as toggleBookmarkApi,
} from '@/lib/supabase/tables/bookmarks'

type BookmarksContextType = {
  bookmarks: Partial<Bookmark>[]
  bookmarkedIds: Set<string>
  isLoading: boolean
  toggleBookmark: (recipeId: string) => Promise<boolean>
  refreshBookmarks: () => Promise<void>
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(
  undefined,
)

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Partial<Bookmark>[]>([])
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [hasFetched, setHasFetched] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const fetchBookmarks = useCallback(
    async (force = false) => {
      if (!user) {
        setBookmarks([])
        setBookmarkedIds(new Set())
        setIsLoading(false)
        setHasFetched(true)
        return
      }

      if (hasFetched && !force) {
        return
      }

      try {
        const [bookmarksList, bookmarkedIdsSet] = await Promise.all([
          getBookmarks(user.id),
          getBookmarkedRecipeIds(user.id),
        ])

        setBookmarks(bookmarksList)
        setBookmarkedIds(bookmarkedIdsSet)
        setHasFetched(true)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching bookmarks:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [user, hasFetched],
  )

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const toggleBookmark = useCallback(
    async (recipeId: string): Promise<boolean> => {
      if (!user) {
        router.push('/login')
        return false
      }

      try {
        const wasBookmarked = bookmarkedIds.has(recipeId)
        const newBookmarkedIds = new Set(bookmarkedIds)

        if (wasBookmarked) {
          newBookmarkedIds.delete(recipeId)
        } else {
          newBookmarkedIds.add(recipeId)
        }
        setBookmarkedIds(newBookmarkedIds)

        const actualState = await toggleBookmarkApi(recipeId, user.id)

        if (actualState !== !wasBookmarked) {
          const revertedIds = new Set(bookmarkedIds)
          if (actualState) {
            revertedIds.add(recipeId)
          } else {
            revertedIds.delete(recipeId)
          }
          setBookmarkedIds(revertedIds)
        }

        return actualState
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error toggling bookmark:', error)
        setBookmarkedIds(bookmarkedIds)
        return false
      }
    },
    [user, router, bookmarkedIds],
  )

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        bookmarkedIds,
        isLoading,
        toggleBookmark,
        refreshBookmarks: () => fetchBookmarks(true),
      }}
    >
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarksContext() {
  const context = useContext(BookmarksContext)
  if (context === undefined) {
    throw new Error(
      'useBookmarksContext must be used within a BookmarksProvider',
    )
  }
  return context
}
