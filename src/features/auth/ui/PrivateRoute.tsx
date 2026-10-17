import { useEffect, type FC, type ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setReturnPath } from '@/store/slices/usersSlice'
import { useAppData } from '@/store/useAppData'
import { Loader } from '@/shared/ui/Loader'

type TProtectedRouteProps = {
  children: ReactElement
  guestOnly?: boolean
}

export const PrivateRoute: FC<TProtectedRouteProps> = ({ children, guestOnly = false }) => {
  const dispatch = useAppDispatch()
  const location = useLocation()

  const user = useAppSelector((state) => state.users.currentUserId)
  const returnPath = useAppSelector((state) => state.users.returnPath)
  const { isLoading } = useAppData()

  // Если гость напрямую открыл защищённую страницу через url
  // сохраняем её pathname для возврата после входа или регистрации
  useEffect(() => {
    if (isLoading) return

    if (!guestOnly && !user) {
      dispatch(setReturnPath(location.pathname))
    }
  }, [isLoading, guestOnly, user, location.pathname, dispatch])

  // Данные приложения ещё загружаются
  if (isLoading) {
    return <Loader text="Загружаем данные" />
  }

  // Страница для авторизованных, но пользователь не вошёл
  if (!guestOnly && !user) {
    return <Navigate replace to="/register" />
  }

  // Страница для неавторизованных, но пользователь уже вошёл, по умолчанию returnPath: '/'
  if (guestOnly && user) {
    return <Navigate replace to={returnPath} />
  }

  return children
}
