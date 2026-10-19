import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { passwordSchema } from '@/shared/lib/passwordValidation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials } from '@/store/slices/registrationSlice'

export type RegistrationCredentialsValues = {
  email: string
  password: string
}

export type RegistrationCredentialsErrors = {
  email?: string
  password?: string
}

export function useRegistrationCredentials() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const savedValues = useAppSelector((state) => state.registration.credentials)
  const users = useAppSelector((state) => state.users.items)

  const [errors, setErrors] = useState<RegistrationCredentialsErrors>({})

  // Правила валидации Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Введите корректный email')
      .required('Email обязателен для заполнения'),
    password: passwordSchema.required('Пароль обязателен для заполнения'),
  })

  // По кнопке "Далее" валидируем поля, проверяем email, сохраняем данные в Redux и открываем второй шаг
  const submitRegistrationCredentials = async (
    data: RegistrationCredentialsValues,
  ): Promise<boolean> => {
    const validationErrors: typeof errors = {}

    try {
      await validationSchema.validate(data, { abortEarly: false })
    } catch (err) {
      if (!(err instanceof Yup.ValidationError)) throw err

      err.inner.forEach((error) => {
        const path = error.path as keyof typeof errors
        if (path) validationErrors[path] = error.message
      })
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return false
    }

    // Проверяем, не занят ли email другим пользователем
    const email = data.email.trim().toLowerCase()
    const emailExists = users.some((user) => user.email.trim().toLowerCase() === email)

    if (emailExists) {
      setErrors({ email: 'Пользователь с таким email уже существует' })
      return false
    }

    setErrors({})
    dispatch(setCredentials({ ...data, email }))
    navigate('/register/profile')
    return true
  }

  return {
    submitRegistrationCredentials,
    errors,
    savedValues,
  }
}
