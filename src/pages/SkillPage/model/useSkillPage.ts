import { useMemo } from 'react'
import { buildCatalogUser, type CatalogCardData } from '@/widgets/UserCard'
import { useAppData } from '@/store/useAppData'
import type { Skill, SkillId } from '@/entities/skill/model/types'
import type { User } from '@/entities/user/model/types'
import type { City } from '@/entities/city/model/types'
import { useSimilarOffers } from './useSimilarOffer'
import { useFavoriteUsers } from '@/features/favorite-user/model/useFavoriteUsers'
import { addFavoriteData } from '@/features/favorite-user/lib/addFavoriteData'
import { useProposeExchange } from '@/features/exchange'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated } from '@/store/selectors/userSelectors'

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
  const { users, cities, categories, skills, isLoading } = useAppData()

  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const { likedUserIds, toggleFavoriteUser } = useFavoriteUsers(isAuthenticated)

  const allSubcategories = useMemo(() => {
    return categories.flatMap((category) => category.subcategories)
  }, [categories])

  const catalogUsers = useMemo(() => {
    return users.map((user) => buildCatalogUser(user, skills, cities, allSubcategories, categories))
  }, [users, skills, cities, allSubcategories, categories])

  const skill = id ? skills.find((s) => s.id === id) : undefined
  const { proposeExchange, canProposeExchange, isAlreadyProposed } = useProposeExchange(skill)
  const author = skill ? users.find((u) => u.id === skill.authorId) : undefined
  const subcategoryId = skill?.subcategoryId ?? ''

  const similarOffers = useSimilarOffers(catalogUsers, subcategoryId, author?.id ?? '')

  const similarOffersWithFavorites = useMemo(() => {
    return addFavoriteData(similarOffers, likedUserIds ?? [])
  }, [similarOffers, likedUserIds])

  const data = useMemo<SkillPageData | null>(() => {
    if (!id || !skill || !author) return null

    const city = cities.find((c) => c.id === author.cityId)
    if (!city) return null

    const authorCard = buildCatalogUser(author, skills, cities, allSubcategories, categories)

    const category = categories.find((c) => c.id === skill.categoryId)
    const subcategory = category?.subcategories.find((s) => s.id === skill.subcategoryId)

    return {
      skill,
      author,
      city,
      categoryName: category?.name ?? '',
      subcategoryName: subcategory?.name ?? '',
      isFavorite: false,
      similarOffers: similarOffersWithFavorites,
      authorTeachSkills: authorCard.teachSkills,
      authorLearnSkills: authorCard.learnSkills,
    }
  }, [id, skill, author, skills, cities, categories, allSubcategories, similarOffersWithFavorites])

  return {
    data,
    loading: isLoading,
    handleFavoriteToggle: toggleFavoriteUser,
    isAuthenticated,
    likedUserIds,
    proposeExchange,
    canProposeExchange,
    isAlreadyProposed,
  }
}
