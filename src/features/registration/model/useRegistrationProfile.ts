import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { SkillCategoryId, SkillSubcategoryId } from '@/entities/category'
import { setProfile } from '@/store/slices/registrationSlice'
import { format } from 'date-fns'
import type { Gender } from '@/entities/user'

import { saveImage } from '@/shared/lib/imageStorage'

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .required('Укажите имя'),
  birthDate: Yup.date()
    .typeError('Неверный формат даты')
    .required('Укажите дату рождения'),
  gender: Yup.string()
    .oneOf(['male', 'female'], 'Выберите пол')
    .required('Выберите пол'),
  city: Yup.string()
    .required('Выберите город'),
  categories: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Выберите хотя бы одну категорию')
    .required('Выберите хотя бы одну категорию'),
  subcategories: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Выберите хотя бы одну подкатегорию')
    .required('Выберите хотя бы одну подкатегорию'),
})

export function useRegistrationProfile() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const savedValues = useAppSelector((state) => state.registration?.profile)
  const [errors, setErrors] = useState<{
    name?: string
    birthDate?: string
    gender?: string
    city?: string
    categories?: string
    subcategories?: string
    avatar?: string
  }>({})

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleAvatarChange = async (file: File) => {
    const MAX_SIZE = 2 * 1024 * 1024

    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({ ...prev, avatar: 'Файл не должен превышать 2 МБ' }))
      return
    }

    setErrors((prev) => ({ ...prev, avatar: undefined }))
    await saveImage('avatar', file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const processRegistrationStep2 = async (data: {
    name: string
    birthDate: Date | undefined
    gender: string
    city: string
    categories: SkillCategoryId[]
    subcategories: SkillSubcategoryId[]
  }) => {
    const validationErrors: typeof errors = {}

    if (!avatarPreview) {
      validationErrors.avatar = 'Добавьте фото'
    }

    try {
      await validationSchema.validate(data, { abortEarly: false })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          const path = error.path as keyof typeof errors
          if (path) validationErrors[path] = error.message
        })
      }
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
        avatarKey: avatarPreview ? 'avatar' : null,
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
    processRegistrationStep2,
    errors,
    savedValues,
    avatarPreview,
    handleAvatarChange,
  }
}
