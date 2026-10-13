import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAppSelector } from '@/store/hooks'

interface PrivateRouteProps {
  children: ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const currentUserId = useAppSelector((state) => state.users.currentUserId)

  if (!currentUserId) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}