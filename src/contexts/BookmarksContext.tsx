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
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      setBookmarks([])
      setBookmarkedIds(new Set())
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    const fetchBookmarks = async () => {
      try {
        const bookmarksList = await getBookmarks(user.id)

        if (!cancelled) {
          const recipeIds = bookmarksList
            .map((b) => b.recipeId)
            .filter(Boolean) as string[]
          const bookmarkedIdsSet = new Set(recipeIds)

          setBookmarks(bookmarksList)
          setBookmarkedIds(bookmarkedIdsSet)
          setIsLoading(false)
        }
      } catch (error) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('Error fetching bookmarks:', error)
          setBookmarks([])
          setBookmarkedIds(new Set())
          setIsLoading(false)
        }
      }
    }

    fetchBookmarks()

    return () => {
      cancelled = true
    }
  }, [user])

  const refreshBookmarks = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const bookmarksList = await getBookmarks(user.id)
      const bookmarkedIdsSet = new Set(
        bookmarksList.map((b) => b.recipeId).filter(Boolean) as string[],
      )

      setBookmarks(bookmarksList)
      setBookmarkedIds(bookmarkedIdsSet)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error refreshing bookmarks:', error)
    }
  }, [user])

  const toggleBookmark = useCallback(
    async (recipeId: string): Promise<boolean> => {
      if (!user) {
        router.push('/login')
        return false
      }

      try {
        let wasBookmarked = false
        setBookmarkedIds((prevIds) => {
          wasBookmarked = prevIds.has(recipeId)
          const newIds = new Set(prevIds)
          if (wasBookmarked) {
            newIds.delete(recipeId)
          } else {
            newIds.add(recipeId)
          }
          return newIds
        })

        const actualState = await toggleBookmarkApi(recipeId, user.id)

        setBookmarkedIds((prevIds) => {
          const correctedIds = new Set(prevIds)
          if (actualState && !correctedIds.has(recipeId)) {
            correctedIds.add(recipeId)
          } else if (!actualState && correctedIds.has(recipeId)) {
            correctedIds.delete(recipeId)
          }
          return correctedIds
        })

        router.refresh()

        return actualState
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error toggling bookmark:', error)
        setBookmarkedIds((prevIds) => {
          const revertedIds = new Set(prevIds)
          if (revertedIds.has(recipeId)) {
            revertedIds.delete(recipeId)
          } else {
            revertedIds.add(recipeId)
          }
          return revertedIds
        })
        return false
      }
    },
    [user, router],
  )

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        bookmarkedIds,
        isLoading,
        toggleBookmark,
        refreshBookmarks,
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
