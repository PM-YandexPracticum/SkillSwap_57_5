import { useLocation, useNavigate } from 'react-router-dom'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCurrentUser } from '@/store/selectors/userSelectors'
import { setReturnPath, updateUser } from '@/store/slices/usersSlice'

interface UseFavoriteUsersResult {
  likedUserIds: string[]
  toggleFavoriteUser: (userId: string) => void
}

export function useFavoriteUsers(
  isAuthenticated: boolean,
): UseFavoriteUsersResult {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const users = useAppSelector((state) => state.users.items)
  const currentUser = useAppSelector(selectCurrentUser)
  const likedUserIds = currentUser?.favoriteUserIds ?? []

  const toggleFavoriteUser = (userId: string) => {
    // Сохраняем pathname текущей страницы и отправляем гостя на регистрацию
    if (!isAuthenticated || !currentUser) {
      dispatch(setReturnPath(location.pathname))
      navigate('/register')
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
