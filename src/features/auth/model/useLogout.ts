import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/usersSlice'
import { clearAuthUser } from './authUtils'

export const useLogout = () => {
  
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  return () => {
    clearAuthUser()
    dispatch(logout())
    
    navigate('/login')
  }
}