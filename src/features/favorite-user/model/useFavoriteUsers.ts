import { useLocation, useNavigate } from 'react-router-dom'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCurrentUser } from '@/store/selectors/userSelectors'
import {
  setReturnPath,
  toggleFavoriteUser as toggleFavoriteUserAction,
} from '@/store/slices/usersSlice'

interface UseFavoriteUsersResult {
  likedUserIds: string[]
  toggleFavoriteUser: (userId: string) => void
}

export function useFavoriteUsers(isAuthenticated: boolean): UseFavoriteUsersResult {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const currentUser = useAppSelector(selectCurrentUser)

  const likedUserIds = currentUser?.favoriteUserIds ?? []

  const toggleFavoriteUser = (userId: string) => {
    // Сохраняем pathname текущей страницы и отправляем гостя на регистрацию
    if (!isAuthenticated || !currentUser) {
      dispatch(setReturnPath(location.pathname))
      navigate('/register')
      return
    }

    // Обновляем избранное и счётчик лайков в Redux
    dispatch(toggleFavoriteUserAction(userId))

    // Сохраняем обновлённых пользователей в localStorage
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.USERS,
      JSON.stringify(store.getState().users.items),
    )
  }

  return {
    likedUserIds,
    toggleFavoriteUser,
  }
}
