import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resetReturnPath, setSession } from '@/store/slices/usersSlice'
import { saveAuthUser } from '../lib/authUtils'

export const useLogin = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users.items)
  const returnPath = useAppSelector((state) => state.users.returnPath)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleLogin = ({ email, password }: { email: string; password: string }) => {
    setSubmitError(null)

    const user = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())

    if (!user || user.password !== password) {
      setSubmitError('Неверный email или пароль')
      return
    }

    const authUser = saveAuthUser({ id: user.id, name: user.email, email: user.email })
    dispatch(setSession({ userId: authUser.id, token: authUser.token }))

    // Возвращаем пользователя на сохранённую страницу и сбрасываем pathname возврата
    navigate(returnPath, { replace: true })

    dispatch(resetReturnPath())
  }

  const errors = submitError ? { password: submitError } : undefined

  return { handleLogin, errors }
}
