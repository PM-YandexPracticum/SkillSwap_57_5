import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from '@reduxjs/toolkit'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { SkillCategoryId, SkillSubcategoryId } from '@/entities/category'
import { setProfile } from '@/store/slices/registrationSlice'
import { format } from 'date-fns'
import type { Gender } from '@/entities/user'

import { AVATAR_IMAGE_PREFIX, saveImage, getImage } from '@/shared/lib/imageStorage'

export type RegistrationProfileValues = {
  name: string
  birthDate: Date | undefined
  gender: string
  city: string
  categories: SkillCategoryId[]
  subcategories: SkillSubcategoryId[]
}

export type RegistrationProfileErrors = {
  name?: string
  birthDate?: string
  gender?: string
  city?: string
  categories?: string
  subcategories?: string
  avatar?: string
}

export function useRegistrationProfile() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const savedValues = useAppSelector((state) => state.registration?.profile)

  const [errors, setErrors] = useState<RegistrationProfileErrors>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Создаём уникальный ключ аватара
  const [avatarKey] = useState(() => savedValues.avatarKey ?? `${AVATAR_IMAGE_PREFIX}${nanoid()}`)

  // Правила валидации Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(2, 'Имя должно содержать минимум 2 символа')
      .required('Укажите имя'),
    birthDate: Yup.date().typeError('Неверный формат даты').required('Укажите дату рождения'),
    gender: Yup.string().oneOf(['male', 'female'], 'Выберите пол').required('Выберите пол'),
    city: Yup.string().required('Выберите город'),
    categories: Yup.array()
      .of(Yup.string().required())
      .min(1, 'Выберите хотя бы одну категорию')
      .required('Выберите хотя бы одну категорию'),
    subcategories: Yup.array()
      .of(Yup.string().required())
      .min(1, 'Выберите хотя бы одну подкатегорию')
      .required('Выберите хотя бы одну подкатегорию'),
  })

  // При выборе аватара валидируем файл, сохраняем его в IndexedDB и передаём файл для предпросмотра
  const handleAvatarChange = async (file: File) => {
    // Файл не более 5 МБ
    const MAX_SIZE = 5 * 1024 * 1024

    // Валидируем размер файла
    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({ ...prev, avatar: 'Файл не должен превышать 5 МБ' }))
      return
    }

    // Валидируем формат файла
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: 'Выберите изображение PNG, JPEG или WebP',
      }))
      return
    }

    try {
      // Сохраняем аватар в IndexedDB по ключу
      await saveImage(avatarKey, file)

      // Передаём файл для предпросмотра
      setAvatarFile(file)

      // Очищаем предыдущую ошибку, если была
      setErrors((prev) => ({ ...prev, avatar: undefined }))
    } catch {
      setErrors((prev) => ({
        ...prev,
        avatar: 'Не удалось сохранить аватар',
      }))
    }
  }

  // Восстанавливаем аватар из IndexedDB по сохранённому ключу и передаём файл для предпросмотра
  useEffect(() => {
    const avatarKey = savedValues?.avatarKey
    if (!avatarKey) return

    // Получаем аватар по ключу, при ошибке загрузки показываем сообщение в форме
    getImage(avatarKey)
      .then((file) => {
        if (file) {
          setAvatarFile(file)
        }
      })
      .catch(() => {
        setErrors((prev) => ({
          ...prev,
          avatar: 'Не удалось загрузить аватар',
        }))
      })
  }, [savedValues?.avatarKey])

  // По кнопке "Продолжить" проверяем наличие аватара, валидируем поля формы, сохраняем профиль в Redux и открываем третий шаг
  const submitRegistrationProfile = async (data: RegistrationProfileValues): Promise<boolean> => {
    const validationErrors: typeof errors = {}

    if (!avatarFile) {
      validationErrors.avatar = 'Добавьте фото'
    }

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

    setErrors({})
    dispatch(
      setProfile({
        name: data.name.trim(),
        avatarUrl: '',
        avatarKey,
        birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : '',
        gender: (data.gender as Gender) ?? null,
        cityId: data.city,
        learningCategoryIds: data.categories,
        learningSubcategoryIds: data.subcategories,
      }),
    )
    navigate('/register/skill')
    return true
  }

  return {
    submitRegistrationProfile,
    errors,
    savedValues,
    avatarFile,
    handleAvatarChange,
  }
}
