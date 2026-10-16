import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { nanoid } from '@reduxjs/toolkit'
import * as Yup from 'yup'
import type { RootState } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSkillDraft } from '@/store/slices/registrationSlice'
import { SKILL_IMAGE_PREFIX, saveImage, getImage, deleteImage } from '@/shared/lib/imageStorage'

export type RegistrationSkillValues = Omit<
  RootState['registration']['skill'],
  'imageUrls' | 'imageKeys'
>

export type RegistrationSkillErrors = {
  title?: string
  categoryId?: string
  subcategoryId?: string
  description?: string
  images?: string
}

export function useRegistrationSkill() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const categories = useAppSelector((state) => state.categories.items)
  const savedValues = useAppSelector((state) => state.registration.skill)

  const [errors, setErrors] = useState<RegistrationSkillErrors>({})
  const [files, setFiles] = useState<File[]>([])
  const [imageKeys, setImageKeys] = useState<string[]>(savedValues.imageKeys)

  // Правила валидации Yup
  const validationSchema = Yup.object({
    title: Yup.string()
      .trim()
      .required('Введите название навыка')
      .min(3, 'Название навыка должно содержать не менее 3 символов')
      .max(50, 'Название навыка должно содержать не более 50 символов'),
    categoryId: Yup.string()
      .required('Выберите категорию навыка')
      .test(
        'category-exists',
        'Выберите категорию из списка',
        (value) => !value || categories.some((category) => category.id === value),
      ),
    subcategoryId: Yup.string()
      .required('Выберите подкатегорию навыка')
      .test(
        'subcategory-belongs-to-category',
        'Выберите подкатегорию выбранной категории',
        (value, context) => {
          if (!value) return true

          const categoryId = context.resolve(Yup.ref('categoryId'))
          const category = categories.find((item) => item.id === categoryId)

          return Boolean(category?.subcategories.some((subcategory) => subcategory.id === value))
        },
      ),
    description: Yup.string()
      .defined('Описание должно быть строкой')
      .max(500, 'Описание должно содержать не более 500 символов'),
  })

  // При выборе фотографий валидируем файлы, сохраняем их в IndexedDB и обновляем предпросмотр
  const handleSkillImagesChange = async (newFiles: File[]) => {
    // Каждый файл не более 5 МБ
    const MAX_SIZE = 5 * 1024 * 1024

    for (const file of newFiles) {
      // Валидируем размер файла
      if (file.size > MAX_SIZE) {
        setErrors((prev) => ({ ...prev, images: 'Файл не должен превышать 5 МБ' }))
        return
      }

      // Валидируем формат файла
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        setErrors((prev) => ({ ...prev, images: 'Выберите изображение PNG, JPEG или WebP' }))
        return
      }
    }

    try {
      const keys: string[] = []

      // Сохраняем каждую фотографию под уникальным ключом
      for (let index = 0; index < newFiles.length; index++) {
        const key = `${SKILL_IMAGE_PREFIX}${nanoid()}`
        await saveImage(key, newFiles[index])
        keys.push(key)
      }

      // Удаляем записи, которые больше не входят в выбранный список фотографий
      const unusedKeys = imageKeys.filter((key) => !keys.includes(key))
      await Promise.all(unusedKeys.map((key) => deleteImage(key)))

      // Обновляем фотографии для предпросмотра и их ключи
      setFiles(newFiles)
      setImageKeys(keys)

      // Очищаем предыдущую ошибку, если была
      setErrors((prev) => ({ ...prev, images: undefined }))
    } catch {
      setErrors((prev) => ({ ...prev, images: 'Не удалось сохранить фотографии' }))
    }
  }

  // Восстанавливаем фотографии из IndexedDB по сохранённым ключам и передаём файлы для предпросмотра
  useEffect(() => {
    const imageKeys = savedValues?.imageKeys
    if (!imageKeys || imageKeys.length === 0) return

    // Получаем фотографии по ключам, при ошибке загрузки показываем сообщение в форме
    Promise.all(imageKeys.map((key) => getImage(key)))
      .then((loadedFiles) => {
        const validFiles = loadedFiles.filter((file): file is File => file !== undefined)
        setFiles(validFiles)
        setImageKeys(imageKeys)
      })
      .catch(() => {
        setErrors((prev) => ({ ...prev, images: 'Не удалось загрузить фотографии' }))
      })
  }, [savedValues?.imageKeys])

  // По кнопке "Продолжить" проверяем наличие фотографий, валидируем поля формы, сохраняем навык в Redux и открываем предпросмотр
  const submitRegistrationSkill = async (data: RegistrationSkillValues): Promise<boolean> => {
    const validationErrors: typeof errors = {}

    if (files.length === 0) {
      validationErrors.images = 'Загрузите хотя бы одно фото навыка'
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
      setSkillDraft({
        title: data.title.trim(),
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        description: data.description,
        imageUrls: [],
        imageKeys,
      }),
    )
    navigate('/register/preview', { state: { backgroundLocation: location } })
    return true
  }

  return {
    submitRegistrationSkill,
    errors,
    savedValues,
    files,
    handleSkillImagesChange,
  }
}
