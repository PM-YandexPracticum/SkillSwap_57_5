import { useEffect, useState } from 'react'
import { getImage } from '@/shared/lib/imageStorage'
import { useAppSelector } from '@/store/hooks'

export function useRegistrationPreview() {
  const savedValues = useAppSelector((state) => state.registration.skill)
  const categories = useAppSelector((state) => state.categories.items)

  const [imageUrls, setImageUrls] = useState<string[]>([])

  // Восстанавливаем фотографии из IndexedDB по сохранённым ключам и создаём адреса для галереи
  useEffect(() => {
    const imageKeys = savedValues.imageKeys
    if (imageKeys.length === 0) {
      setImageUrls([])
      return
    }

    // Получаем фотографии по ключам и создаём адрес для каждого найденного файла
    Promise.all(imageKeys.map((key) => getImage(key))).then((files) => {
      const previewUrls = files
        .filter((file): file is File => file !== undefined)
        .map((file) => URL.createObjectURL(file))

      setImageUrls(previewUrls)
    })
  }, [savedValues.imageKeys])

  // При замене фотографий или уходе со страницы удаляем старые blob-адреса из памяти браузера
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageUrls])

  // Находим названия выбранных категории и подкатегории для предпросмотра
  const category = categories.find((category) => category.id === savedValues.categoryId)
  const subcategory = category?.subcategories.find(
    (subcategory) => subcategory.id === savedValues.subcategoryId,
  )

  return {
    title: savedValues.title,
    description: savedValues.description,
    categoryName: category?.name ?? '',
    subcategoryName: subcategory?.name ?? '',
    imageUrls,
  }
}
