import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/usersSlice'
import { clearAuthUser } from './authUtils'
import { clearAllImages } from '@/shared/lib/imageStorage'

export const useLogout = () => {
  
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  return async () => {
    await clearAllImages()
    clearAuthUser()
    dispatch(logout())
    
    navigate('/login')
  }
}