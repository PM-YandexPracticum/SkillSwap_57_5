import { useMemo } from 'react'
import type { Skill, SkillId } from '@/entities/skill/model/types'
import type { User } from '@/entities/user/model/types'
import type { City } from '@/entities/city/model/types'
import type { CatalogCardData } from '@/features/catalog/model/types'
import { useCatalogData } from '@/features/catalog/model/useCatalogData'

export type SkillPageData = {
  skill: Skill
  author: User
  city: City
  categoryName: string
  subcategoryName: string
  isFavorite: boolean
  similarOffers: CatalogCardData[]
  authorTeachSkills: Skill[]
  authorLearnSkills: Skill[]
}

export function useSkillPage(id: SkillId | undefined) {
  const { users, cities, categories, skills, isLoading } = useCatalogData()

  const data = useMemo<SkillPageData | null>(() => {
    if (!id) return null

    const skill = skills.find((s) => s.id === id)
    if (!skill) return null

    const author = users.find((u) => u.id === skill.authorId)
    if (!author) return null

    const city = cities.find((c) => c.id === author.cityId)
    if (!city) return null

    const authorTeachSkills = skills.filter((s) => s.authorId === author.id)

    const authorLearnSkills = author.learningSubcategoryIds?.length
      ? skills.filter((s) => author.learningSubcategoryIds.includes(s.subcategoryId))
      : []

    const category = categories.find((c) => c.id === skill.categoryId)
    const subcategory = category?.subcategories.find((s) => s.id === skill.subcategoryId)

    // похожие предложения (исключаем автора)
    const similarOffers: CatalogCardData[] = users
      .filter((user) => user.id !== author.id)
      .slice(0, 8)
      .map((user) => {
        // Чему учит этот пользователь
        const teach = skills.filter((s) => s.authorId === user.id)
        // Чему хочет научиться этот пользователь (скиллы по его интересам)
        const learn = user.learningSubcategoryIds?.length
          ? skills.filter((s) => user.learningSubcategoryIds.includes(s.subcategoryId))
          : []

        const userCity = cities.find((c) => c.id === user.cityId)
        return {
          user,
          cityName: userCity?.name ?? '',
          teachSkills: teach,
          learnSkills: learn,
          additionalTeachSkillsCount: Math.max(0, teach.length - 1),
          additionalLearnSkillsCount: Math.max(0, learn.length - 2),
          latestSkillCreatedAt: '',
          isFavorite: false,
          displayedLikeCount: user.likesCount,
        }
      })

    return {
      skill,
      author,
      city,
      categoryName: category?.name ?? '',
      subcategoryName: subcategory?.name ?? '',
      isFavorite: false,
      similarOffers,
      authorTeachSkills,
      authorLearnSkills,
    }
  }, [id, skills, users, cities, categories])

  return { data, loading: isLoading }
}
