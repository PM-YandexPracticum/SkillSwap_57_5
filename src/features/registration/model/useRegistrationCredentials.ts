import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials } from '@/store/slices/registrationSlice'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Введите корректный email')
    .required('Email обязателен для заполнения'),
  password: Yup.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .required('Пароль обязателен для заполнения'),
})

export function useRegistrationCredentials() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const savedValues = useAppSelector((state) => state.registration?.credentials)
  const users = useAppSelector((state) => state.users.items)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const processRegistrationStep1 = async (data: { email: string; password: string }) => {
    try {
      await validationSchema.validate(data, { abortEarly: false })
      const email = data.email.trim().toLowerCase()
      const emailExists = users.some(
        (user) => user.email.trim().toLowerCase() === email,
      )

      if (emailExists) {
        setErrors({ email: 'Пользователь с таким email уже существует' })
        return false
      }

      setErrors({})
      
      dispatch(setCredentials({ ...data, email }))
      navigate('/register/profile')
      return true
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: { email?: string; password?: string } = {}
        err.inner.forEach((error) => {
          if (error.path === 'email') validationErrors.email = error.message
          if (error.path === 'password') validationErrors.password = error.message
        })
        setErrors(validationErrors)
      }
      return false
    }
  }

  return {
    processRegistrationStep1,
    errors,
    savedValues,
  }
}
