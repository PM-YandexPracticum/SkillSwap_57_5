import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCurrentUser } from '@/store/selectors/userSelectors'
import { updateUser } from '@/store/slices/usersSlice'

interface UseFavoriteUsersResult {
  likedUserIds: string[]
  toggleFavoriteUser: (userId: string) => void
}

export function useFavoriteUsers(
  isAuthenticated: boolean,
): UseFavoriteUsersResult {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users.items)
  const currentUser = useAppSelector(selectCurrentUser)
  const likedUserIds = currentUser?.favoriteUserIds ?? []

  const toggleFavoriteUser = (userId: string) => {
    if (!isAuthenticated || !currentUser) {
      return
    }

    const favoriteUserIds = currentUser.favoriteUserIds.includes(userId)
      ? currentUser.favoriteUserIds.filter((id) => id !== userId)
      : [...currentUser.favoriteUserIds, userId]

    const updatedUser = {
      ...currentUser,
      favoriteUserIds,
    }

    dispatch(updateUser(updatedUser))

    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user,
    )

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.USERS,
      JSON.stringify(updatedUsers),
    )
  }

  return {
    likedUserIds,
    toggleFavoriteUser,
  }
}
