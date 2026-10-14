import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'

export function useRegistrationPreview() {
  const skill = useAppSelector((state) => state.registration?.skill)
  const categories = useAppSelector((state) => state.categories.items)

  const data = useMemo(() => {
    if (!skill) return null

    const category = categories.find((c) => c.id === skill.categoryId)
    const subcategory = category?.subcategories.find((s) => s.id === skill.subcategoryId)

    return {
      title: skill.title,
      description: skill.description,
      categoryName: category?.name ?? '',
      subcategoryName: subcategory?.name ?? '',
      imageUrls: skill.imageUrls,
    }
  }, [skill, categories])

  return data
}
