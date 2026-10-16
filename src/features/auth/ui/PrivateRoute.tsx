import type { FC, ReactElement } from 'react'
import { Navigate, useLocation, type Location } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { useAppData } from '@/store/useAppData'
import { Loader } from '@/shared/ui/Loader'

type TProtectedRouteProps = {
  children: ReactElement
  onlyUnAuth?: boolean
}

export const PrivateRoute: FC<TProtectedRouteProps> = ({ children, onlyUnAuth = false }) => {
  const user = useAppSelector((state) => state.users.currentUserId)
  const location = useLocation()
  const { isLoading } = useAppData()

  // Данные приложения ещё загружаются
  if (isLoading) {
    return <Loader text="Загружаем данные" />
  }

  // Страница для авторизованных, но пользователь не вошел
  if (!onlyUnAuth && !user) {
    return <Navigate replace to="/login" state={{ from: location }} />
  }

  // Страница для неавторизованных, но пользователь уже вошёл
  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location })?.from || { pathname: '/' }
    return <Navigate replace to={from} />
  }

  return children
}
