import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { logout, resetReturnPath } from '@/store/slices/usersSlice'
import { clearAuthUser } from '../lib/authUtils'

export const useLogout = () => {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  return async () => {
    clearAuthUser()
    dispatch(logout())
    dispatch(resetReturnPath())

    navigate('/login')
  }
}
