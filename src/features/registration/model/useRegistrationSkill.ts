import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import type { SkillCategory } from '@/entities/category'
import type { RootState } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSkillDraft } from '@/store/slices/registrationSlice'
import { saveImage, getImage, deleteImage  } from '@/shared/lib/imageStorage'

export type RegistrationSkillValues = Omit<
  RootState['registration']['skill'],
  'imageUrls' | 'imageKeys'>

export type RegistrationSkillErrors = Partial<
  Record<keyof RegistrationSkillValues | 'images', string>
>

function createValidationSchema(
  categories: SkillCategory[],
): Yup.ObjectSchema<RegistrationSkillValues> {
  return Yup.object({
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
}

export function useRegistrationSkill() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categories.items)
  const savedValues = useAppSelector((state) => state.registration.skill)
  const [errors, setErrors] = useState<RegistrationSkillErrors>({})
  const [files, setFiles] = useState<File[]>([])

  const MAX_SIZE = 2 * 1024 * 1024

  const handleFilesChange = async (newFiles: File[]) => {
    const validFiles: File[] = []
    let hasOversizedFile = false

    for (const file of newFiles) {
      if (file.size > MAX_SIZE) {
        hasOversizedFile = true
      } else {
        validFiles.push(file)
      }
    }

    setErrors((prev) => ({
      ...prev,
      images: hasOversizedFile ? 'Файл не должен превышать 2 МБ' : undefined,
    }))

    const oldKeys = savedValues?.imageKeys ?? []
    await Promise.all(oldKeys.map((key) => deleteImage(key)))

    const keys: string[] = []
    for (let i = 0; i < validFiles.length; i++) {
      const key = `skill-image-${i}`
      await saveImage(key, validFiles[i])
      keys.push(key)
    }

    setFiles(validFiles)

    dispatch(
      setSkillDraft({
        ...savedValues,
        imageKeys: keys,
      }),
    )
  }

  useEffect(() => {
    const imageKeys = savedValues?.imageKeys
    if (!imageKeys || imageKeys.length === 0) return

    let cancelled = false

    Promise.all(imageKeys.map((key) => getImage(key))).then((loadedFiles) => {
      if (cancelled) return

      const validFiles = loadedFiles.filter((file): file is File => file !== undefined)
      setFiles(validFiles)
    })

    return () => {
      cancelled = true
    }
  }, [savedValues?.imageKeys])

  const processRegistrationStep3 = async (data: RegistrationSkillValues): Promise<boolean> => {
    if (files.length === 0) {
      setErrors({ images: 'Загрузите хотя бы одно фото навыка' })
      return false
    }

    try {
      const values = await createValidationSchema(categories).validate(data, { abortEarly: false })

      dispatch(
        setSkillDraft({
          title: values.title,
          categoryId: values.categoryId,
          subcategoryId: values.subcategoryId,
          description: values.description,
          imageUrls: [],
          imageKeys: files.map((_, index) => `skill-image-${index}`),
        }),
      )
      setErrors({})
      return true
    } catch (err) {
      if (!(err instanceof Yup.ValidationError)) throw err

      const validationErrors: RegistrationSkillErrors = {}

      for (const error of err.inner.length > 0 ? err.inner : [err]) {
        const field = error.path

        if (
          field === 'title' ||
          field === 'categoryId' ||
          field === 'subcategoryId' ||
          field === 'description'
        ) {
          validationErrors[field] ??= error.message
        }
      }

      setErrors(validationErrors)
      return false
    }
  }

  return {
    processRegistrationStep3,
    errors,
    savedValues,
    files,
    handleFilesChange,
  }
}
