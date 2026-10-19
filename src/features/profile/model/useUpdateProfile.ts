import { useState } from 'react'
import { generateId } from '@/shared/lib/helpers'
import { format, subYears } from 'date-fns'
import * as Yup from 'yup'
import type { Gender, User } from '@/entities/user'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { passwordSchema } from '@/shared/lib/passwordValidation'
import { AVATAR_IMAGE_PREFIX, saveImage, deleteImage } from '@/shared/lib/imageStorage'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCurrentUser } from '@/store/selectors/userSelectors'
import { updateUser } from '@/store/slices/usersSlice'

export type UpdateProfileValues = {
  email: string
  password: string
  name: string
  birthDate: Date | undefined
  gender: string
  city: string
  about: string
}

export type UpdateProfileErrors = {
  email?: string
  password?: string
  name?: string
  birthDate?: string
  gender?: string
  city?: string
  avatar?: string
}

export function useUpdateProfile() {
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector(selectCurrentUser)
  const users = useAppSelector((state) => state.users.items)

  const [errors, setErrors] = useState<UpdateProfileErrors>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Проверяем выбранный аватар и передаём файл для предпросмотра
  const handleAvatarChange = (file: File) => {
    const MAX_SIZE = 2 * 1024 * 1024

    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({
        ...prev,
        avatar: 'Файл не должен превышать 2 МБ',
      }))
      return
    }

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: 'Выберите изображение PNG, JPEG или WebP',
      }))
      return
    }

    setAvatarFile(file)
    setErrors((prev) => ({ ...prev, avatar: undefined }))
  }

  const maxBirthDate = subYears(new Date(), 14)

  // Правила валидации Yup
  const validationSchema = Yup.object({
    email: Yup.string().trim().email('Введите корректный email').required('Укажите email'),
    password: passwordSchema.transform((value) => (value === '' ? undefined : value)).optional(),
    name: Yup.string()
      .trim()
      .min(2, 'Имя должно содержать минимум 2 символа')
      .required('Укажите имя'),
    birthDate: Yup.date()
      .typeError('Неверный формат даты')
      .max(maxBirthDate, 'Возраст должен быть не меньше 14 лет')
      .required('Укажите дату рождения'),
    gender: Yup.string().oneOf(['male', 'female'], 'Выберите пол').required('Выберите пол'),
    city: Yup.string().required('Выберите город'),
  })

  // Валидируем поля и сохраняем обновлённого пользователя в localStorage и redux
  const submitProfileUpdate = async (data: UpdateProfileValues) => {
    if (!currentUser) return

    // Валидируем поля и собираем ошибки
    try {
      await validationSchema.validate(data, { abortEarly: false })
    } catch (err) {
      if (!(err instanceof Yup.ValidationError)) throw err

      const validationErrors: UpdateProfileErrors = {}

      err.inner.forEach((error) => {
        const path = error.path as keyof UpdateProfileErrors
        if (path) validationErrors[path] = error.message
      })

      setErrors(validationErrors)
      return
    }

    // Проверяем не занят ли email другим пользователем
    const emailExists = users.some(
      (user) =>
        user.id !== currentUser.id && user.email.toLowerCase() === data.email.trim().toLowerCase(),
    )

    if (emailExists) {
      setErrors({ email: 'Пользователь с таким email уже существует' })
      return
    }

    setErrors({})

    const updatedUser: User = {
      ...currentUser,
      email: data.email.trim().toLowerCase(),
      password: data.password || currentUser.password,
      name: data.name.trim(),
      birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : '',
      gender: data.gender as Gender,
      cityId: data.city,
      about: data.about,
    }

    try {
      // Сохраняем новое фото только при нажатии "Сохранить"
      if (avatarFile) {
        const avatarKey = `${AVATAR_IMAGE_PREFIX}${generateId()}`

        await saveImage(avatarKey, avatarFile)

        updatedUser.avatarKey = avatarKey
        updatedUser.avatarUrl = URL.createObjectURL(avatarFile)
      }

      // Заменяем текущего пользователя в списке и сохраняем список в localStorage
      const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))

      localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(updatedUsers))

      // Обновляем пользователя в redux после сохранения
      dispatch(updateUser(updatedUser))

      // Файл уже сохранён, повторно записывать его не нужно
      setAvatarFile(null)

      // После успешной замены удаляем прежний файл
      if (avatarFile && currentUser.avatarKey) {
        await deleteImage(currentUser.avatarKey)
      }

      // Заглушка успешного изменения данных
      alert('Профиль обновлён!')
    } catch {
      // Заглушка ошибки изменения данных
      alert('Не удалось сохранить профиль. Попробуйте ещё раз')
    }
  }

  return {
    currentUser,
    errors,
    submitProfileUpdate,
    avatarFile,
    handleAvatarChange,
  }
}
