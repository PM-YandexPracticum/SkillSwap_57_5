import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

interface UseFavoriteUsersResult {
  likedUserIds: string[]
  toggleFavoriteUser: (userId: string) => void
}

export function useFavoriteUsers(
  isAuthenticated: boolean,
): UseFavoriteUsersResult {
  const [likedUserIds, setLikedUserIds] = useLocalStorage<string[]>(
    LOCAL_STORAGE_KEYS.FAVORITES,
    [],
  )

  const toggleFavoriteUser = (userId: string) => {
    if (!isAuthenticated) {
      return
    }

    setLikedUserIds((currentLikedUserIds) => {
      if (currentLikedUserIds.includes(userId)) {
        return currentLikedUserIds.filter(
          (likedUserId) => likedUserId !== userId,
        )
      }

      return [...currentLikedUserIds, userId]
    })
  }

  return {
    likedUserIds,
    toggleFavoriteUser,
  }
}
