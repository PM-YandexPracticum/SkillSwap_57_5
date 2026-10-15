import { useMemo, useState, useEffect } from 'react'
import { getImage } from '@/shared/lib/imageStorage'
import { useAppSelector } from '@/store/hooks'

export function useRegistrationPreview() {
  const skill = useAppSelector((state) => state.registration?.skill)
  const categories = useAppSelector((state) => state.categories.items)

  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    const keys = skill?.imageKeys ?? []
    if (keys.length === 0) {
      setImageUrls([])
      return
    }

    let cancelled = false

    Promise.all(keys.map((key) => getImage(key))).then((files) => {
      if (cancelled) return

      const urls = files
        .filter((file): file is File => file !== undefined)
        .map((file) => URL.createObjectURL(file))

      setImageUrls(urls)
    })

    return () => {
      cancelled = true
    }
  }, [skill?.imageKeys])

  const data = useMemo(() => {
    if (!skill) return null

    const category = categories.find((c) => c.id === skill.categoryId)
    const subcategory = category?.subcategories.find((s) => s.id === skill.subcategoryId)

    return {
      title: skill.title,
      description: skill.description,
      categoryName: category?.name ?? '',
      subcategoryName: subcategory?.name ?? '',
      imageUrls,
    }
  }, [skill, categories, imageUrls])

  return data
}
