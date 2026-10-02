import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { ActiveFilter, CatalogFilters, CatalogUser } from './model/types'
import {
  buildActiveFilters,
  filterCatalogUsers,
  filterCatalogUsersBySearch,
} from './model/filters'
import {
  sortUsersByNewestSkill,
  sortUsersByPopularity,
  sortUsersByRegistrationDate,
} from './model/sorting'
import { buildCatalogUsers } from './model/users'
import { useCatalogData } from './hooks/useCatalogData'
import {
  EXPANDED_SECTION_SIZE,
  INITIAL_CATALOG_FILTERS,
  INITIAL_RECOMMENDED_SIZE,
  INITIAL_SECTION_SIZE,
  RECOMMENDED_INCREMENT,
} from './model/constants'
import { loadSkills } from '@/entities/skill/model/skillsSlice'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import type { UserGender } from '@/shared/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { SkillCard } from '@/widgets/SkillCard'
import { FiltersBar } from '@/widgets/FiltersBar'
import { FiltersResult } from '@/widgets/FiltersResult'

import styles from './CatalogPage.module.css'

interface CatalogSection {
  title: string
  users: CatalogUser[]
  showAll: boolean
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') ?? ''

  const dispatch = useAppDispatch()

  const {
    users,
    usersStatus,
    usersError,
    cities,
    citiesStatus,
    citiesError,
    categories,
    categoriesStatus,
    categoriesError,
  } = useCatalogData()

  const skills = useAppSelector((state) => state.skills.items)
  const skillsStatus = useAppSelector((state) => state.skills.status)
  const skillsError = useAppSelector((state) => state.skills.error)

  const [likedUserIds, setLikedUserIds] = useLocalStorage<string[]>(
    LOCAL_STORAGE_KEYS.FAVORITES,
    [],
  )

  const [filters, setFilters] = useState<CatalogFilters>(INITIAL_CATALOG_FILTERS)

  const [isSortedByNewest, setIsSortedByNewest] = useState(false)

  const [isPopularExpanded, setIsPopularExpanded] = useState(false)
  const [isNewExpanded, setIsNewExpanded] = useState(false)
  const [recommendedVisibleCount, setRecommendedVisibleCount] = useState(INITIAL_RECOMMENDED_SIZE)

  const recommendedLoadMoreRef = useRef<HTMLDivElement | null>(null)

  // Временная заглушка до реализации авторизации.
  // Позже это значение будет приходить из auth-состояния.
  const isAuthenticated = true

  useEffect(() => {
    if (skillsStatus === 'idle') {
      dispatch(loadSkills())
    }
  }, [dispatch, skillsStatus])

  const likedUserIdSet = useMemo(() => {
    return new Set(likedUserIds)
  }, [likedUserIds])

  const catalogUsers = useMemo(() => {
    return buildCatalogUsers(users, skills, cities)
  }, [cities, skills, users])

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filters.mode !== 'all' ||
    filters.gender !== null ||
    filters.cityIds.length > 0 ||
    filters.skillCategories.length > 0

  const filteredUsers = useMemo(() => {
    return filterCatalogUsers(catalogUsers, filters)
  }, [catalogUsers, filters])

  const searchFilteredUsers = useMemo(() => {
    return filterCatalogUsersBySearch(filteredUsers, searchQuery)
  }, [filteredUsers, searchQuery])

  const activeFilters = useMemo(() => {
    return buildActiveFilters(filters, cities, categories)
  }, [categories, cities, filters])

  const sortedFilteredUsers = useMemo(() => {
    if (isSortedByNewest) {
      return sortUsersByNewestSkill(searchFilteredUsers)
    }

    return sortUsersByPopularity(searchFilteredUsers, likedUserIds)
  }, [isSortedByNewest, likedUserIds, searchFilteredUsers])

  const popularUsers = useMemo(() => {
    return sortUsersByPopularity(catalogUsers, likedUserIds)
  }, [catalogUsers, likedUserIds])

  const newUsers = useMemo(() => {
    return sortUsersByNewestSkill(catalogUsers)
  }, [catalogUsers])

  const recommendedUsers = useMemo(() => {
    return sortUsersByRegistrationDate(catalogUsers)
  }, [catalogUsers])

  const visiblePopularUsers = useMemo(() => {
    const visibleCount = isPopularExpanded ? EXPANDED_SECTION_SIZE : INITIAL_SECTION_SIZE

    return popularUsers.slice(0, visibleCount)
  }, [isPopularExpanded, popularUsers])

  const visibleNewUsers = useMemo(() => {
    const visibleCount = isNewExpanded ? EXPANDED_SECTION_SIZE : INITIAL_SECTION_SIZE

    return newUsers.slice(0, visibleCount)
  }, [isNewExpanded, newUsers])

  const visibleRecommendedUsers = useMemo(() => {
    return recommendedUsers.slice(0, recommendedVisibleCount)
  }, [recommendedUsers, recommendedVisibleCount])

  const handleFavoriteToggle = (userId: string) => {
    if (!isAuthenticated) {
      return
    }

    setLikedUserIds((currentLikedUserIds) => {
      if (currentLikedUserIds.includes(userId)) {
        return currentLikedUserIds.filter((likedUserId) => likedUserId !== userId)
      }

      return [...currentLikedUserIds, userId]
    })
  }

  const handleModeChange = (mode: CatalogFilters['mode']) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      mode,
    }))
  }

  const handleGenderChange = (gender: UserGender | null) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      gender,
    }))
  }

  const handleCityToggle = (cityId: string) => {
    setFilters((currentFilters) => {
      const isCitySelected = currentFilters.cityIds.includes(cityId)

      const cityIds = isCitySelected
        ? currentFilters.cityIds.filter((selectedCityId) => selectedCityId !== cityId)
        : [...currentFilters.cityIds, cityId]

      return {
        ...currentFilters,
        cityIds,
      }
    })
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((currentFilters) => {
      const isCategorySelected = currentFilters.skillCategories.some(
        (skillCategory) => skillCategory.categoryId === categoryId,
      )

      if (isCategorySelected) {
        return {
          ...currentFilters,
          skillCategories: currentFilters.skillCategories.filter(
            (skillCategory) => skillCategory.categoryId !== categoryId,
          ),
        }
      }

      return {
        ...currentFilters,
        skillCategories: [
          ...currentFilters.skillCategories,
          {
            categoryId,
            subcategoryIds: [],
          },
        ],
      }
    })
  }

  const handleSubcategoryToggle = (categoryId: string, subcategoryId: string) => {
    setFilters((currentFilters) => {
      const selectedCategory = currentFilters.skillCategories.find(
        (skillCategory) => skillCategory.categoryId === categoryId,
      )

      if (!selectedCategory) {
        return {
          ...currentFilters,
          skillCategories: [
            ...currentFilters.skillCategories,
            {
              categoryId,
              subcategoryIds: [subcategoryId],
            },
          ],
        }
      }

      const isSubcategorySelected = selectedCategory.subcategoryIds.includes(subcategoryId)

      const subcategoryIds = isSubcategorySelected
        ? selectedCategory.subcategoryIds.filter(
            (selectedSubcategoryId) => selectedSubcategoryId !== subcategoryId,
          )
        : [...selectedCategory.subcategoryIds, subcategoryId]

      return {
        ...currentFilters,
        skillCategories: currentFilters.skillCategories.map((skillCategory) =>
          skillCategory.categoryId === categoryId
            ? {
                ...skillCategory,
                subcategoryIds,
              }
            : skillCategory,
        ),
      }
    })
  }

  useEffect(() => {
    if (recommendedVisibleCount >= recommendedUsers.length) {
      return
    }

    const loadMoreElement = recommendedLoadMoreRef.current

    if (!loadMoreElement) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry.isIntersecting) {
          return
        }

        setRecommendedVisibleCount((currentVisibleCount) =>
          Math.min(currentVisibleCount + RECOMMENDED_INCREMENT, recommendedUsers.length),
        )
      },
      {
        rootMargin: '200px',
      },
    )

    observer.observe(loadMoreElement)

    return () => {
      observer.disconnect()
    }
  }, [recommendedUsers.length, recommendedVisibleCount, isPopularExpanded, isNewExpanded])

  const sections = useMemo<CatalogSection[]>(() => {
    return [
      {
        title: 'Популярное',
        users: visiblePopularUsers,
        showAll: popularUsers.length > INITIAL_SECTION_SIZE,
      },
      {
        title: 'Новое',
        users: visibleNewUsers,
        showAll: newUsers.length > INITIAL_SECTION_SIZE,
      },
      {
        title: 'Рекомендуем',
        users: visibleRecommendedUsers,
        showAll: false,
      },
    ]
  }, [
    newUsers.length,
    popularUsers.length,
    visibleNewUsers,
    visiblePopularUsers,
    visibleRecommendedUsers,
  ])

  const handleTogglePopular = () => {
    setIsPopularExpanded((isExpanded) => !isExpanded)
  }

  const handleToggleNew = () => {
    setIsNewExpanded((isExpanded) => !isExpanded)
  }

  const isLoading =
    skillsStatus === 'loading' ||
    usersStatus === 'loading' ||
    citiesStatus === 'loading' ||
    categoriesStatus === 'loading'

  if (isLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>Загрузка...</p>
      </main>
    )
  }

  if (skillsStatus === 'failed') {
    return (
      <main className={styles.page}>
        <p className={styles.message}>{skillsError ?? 'Не удалось загрузить навыки'}</p>
      </main>
    )
  }

  if (usersStatus === 'failed') {
    return (
      <main className={styles.page}>
        <p className={styles.message}>{usersError ?? 'Не удалось загрузить пользователей'}</p>
      </main>
    )
  }

  if (citiesStatus === 'failed') {
    return (
      <main className={styles.page}>
        <p className={styles.message}>{citiesError ?? 'Не удалось загрузить города'}</p>
      </main>
    )
  }

  if (categoriesStatus === 'failed') {
    return (
      <main className={styles.page}>
        <p className={styles.message}>
          {categoriesError ?? 'Не удалось загрузить категории'}
        </p>
      </main>
    )
  }

  const handleResetFilters = () => {
    setFilters(INITIAL_CATALOG_FILTERS)
  }

  const handleRemoveFilter = (filter: ActiveFilter) => {
    setFilters((currentFilters) => {
      switch (filter.type) {
        case 'mode':
          return {
            ...currentFilters,
            mode: 'all',
          }

        case 'gender':
          return {
            ...currentFilters,
            gender: null,
          }

        case 'city':
          return {
            ...currentFilters,
            cityIds: currentFilters.cityIds.filter(
              (cityId) => cityId !== filter.value,
            ),
          }

        case 'category':
          return {
            ...currentFilters,
            skillCategories: currentFilters.skillCategories.filter(
              (skillCategory) => skillCategory.categoryId !== filter.value,
            ),
          }

        case 'subcategory':
          return {
            ...currentFilters,
            skillCategories: currentFilters.skillCategories.map(
              (skillCategory) => {
                if (skillCategory.categoryId !== filter.categoryId) {
                  return skillCategory
                }

                return {
                  ...skillCategory,
                  subcategoryIds: skillCategory.subcategoryIds.filter(
                    (subcategoryId) => subcategoryId !== filter.value,
                  ),
                }
              },
            ),
          }

        default:
          return currentFilters
      }
    })
  }

  const handleSortToggle = () => {
    setIsSortedByNewest((isNewest) => !isNewest)
  }

  return (
    <main className={styles.page}>
      <FiltersBar
        filters={filters}
        categories={categories}
        cities={cities}
        onModeChange={handleModeChange}
        onGenderChange={handleGenderChange}
        onCityToggle={handleCityToggle}
        onCategoryToggle={handleCategoryToggle}
        onSubcategoryToggle={handleSubcategoryToggle}
        onReset={handleResetFilters}
      />

      <div className={styles.content}>
        {hasActiveFilters ? (
          <FiltersResult
            activeFilters={activeFilters}
            users={sortedFilteredUsers}
            isAuthenticated={isAuthenticated}
            likedUserIds={likedUserIds}
            resultCount={searchFilteredUsers.length}
            isSortedByNewest={isSortedByNewest}
            onRemoveFilter={handleRemoveFilter}
            onSortToggle={handleSortToggle}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ) : (
        sections.map((section) => (
          <section
            key={section.title}
            className={styles.section}
            aria-labelledby={`${section.title}-title`}
          >
            <div className={styles.sectionHead}>
              <h1 id={`${section.title}-title`} className={styles.sectionTitle}>
                {section.title}
              </h1>

              {section.title === 'Популярное' && section.showAll && (
                <button
                  type="button"
                  className={styles.viewAllButton}
                  onClick={handleTogglePopular}
                >
                  <span>{isPopularExpanded ? 'Свернуть' : 'Смотреть все'}</span>

                  <svg
                    className={styles.chevronIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d={isPopularExpanded ? 'M5 15L12 8L19 15' : 'M9 5L16 12L9 19'}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              {section.title === 'Новое' && section.showAll && (
                <button type="button" className={styles.viewAllButton} onClick={handleToggleNew}>
                  <span>{isNewExpanded ? 'Свернуть' : 'Смотреть все'}</span>

                  <svg
                    className={styles.chevronIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d={isNewExpanded ? 'M5 15L12 8L19 15' : 'M9 5L16 12L9 19'}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            <ul className={styles.cardsGrid}>
              {section.users.map(({ user, cityName, teachSkills, learnSkills }) => {
                const isFavorite = likedUserIdSet.has(user.id)
                const displayedLikeCount = user.likeCount + (isFavorite ? 1 : 0)

                return (
                  <li key={user.id} className={styles.cardItem}>
                    <SkillCard
                      user={user}
                      cityName={cityName}
                      teachSkills={teachSkills}
                      learnSkills={learnSkills}
                      isFavorite={isFavorite}
                      likeCount={displayedLikeCount}
                      isAuthenticated={isAuthenticated}
                      onFavoriteToggle={() => handleFavoriteToggle(user.id)}
                    />
                  </li>
                )
              })}
            </ul>

            {section.title === 'Рекомендуем' && (
              <div
                ref={recommendedLoadMoreRef}
                className={styles.loadMoreTrigger}
                aria-hidden="true"
              />
            )}
          </section>
        ))
        )}
      </div>
    </main>
  )
}
