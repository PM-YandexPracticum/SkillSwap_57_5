import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { SkillCategoryId, SkillSubcategoryId } from '@/entities/category'
import { setProfile } from '@/store/slices/registrationSlice'
import { format } from 'date-fns'
import type { Gender } from '@/entities/user'

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
  }>({})

  const processRegistrationStep2 = async (data: {
    name: string
    birthDate: Date | undefined
    gender: string
    city: string
    categories: SkillCategoryId[]
    subcategories: SkillSubcategoryId[]
  }) => {
      try {
        await validationSchema.validate(data, { abortEarly: false })
        setErrors({})
        
        dispatch(
          setProfile({
            name: data.name.trim(),
            avatarUrl: '',
            birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : '',
            gender: (data.gender as Gender) ?? null,
            cityId: data.city,
            learningCategoryIds: data.categories,
            learningSubcategoryIds: data.subcategories,
          }),
        )
        navigate('/register/skill')
        return true
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors: typeof errors = {}
          err.inner.forEach((error) => {
            const path = error.path as keyof typeof errors
            if (path) validationErrors[path] = error.message
          })
          setErrors(validationErrors)
        }
        return false
      }
    }
  
    return {
      processRegistrationStep2,
      errors,
      savedValues,
    }

  }
