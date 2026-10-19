import { useMemo, useState } from 'react'

import {
  buildActiveFilters,
  countActiveFilters,
  filterCatalogUsers,
  useCatalogFilters,
  type ActiveFilter,
  type UseCatalogFiltersResult,
} from '@/features/filter-catalog'

import { useFavoriteUsers, addFavoriteData } from '@/features/favorite-user'
import { buildCatalogUser, type CatalogCardData } from '@/widgets/UserCard'
import { useAppData } from '@/store/useAppData'

import { filterCatalogUsersBySearch, useSearchQuery } from '@/features/search-skills'
import type { City } from '@/entities/city'
import type { SkillCategory } from '@/entities/category'

import {
  sortCatalogUsersByNewestSkill,
  sortCatalogUsersByPopularity,
} from '../lib/sortCatalogUsers'

import { useCatalogSections } from './useCatalogSections'
import type { CatalogSection, CatalogSectionId } from './types'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated } from '@/store/selectors/userSelectors'

interface UseCatalogPageResult {
  // Для CatalogPage
  errorMessage: string | null
  hasActiveFilters: boolean

  // Для FiltersBar
  filters: UseCatalogFiltersResult['filters']
  categories: SkillCategory[]
  cities: City[]
  isSearchActive: boolean
  handleModeChange: UseCatalogFiltersResult['handleModeChange']
  handleGenderChange: UseCatalogFiltersResult['handleGenderChange']
  handleCityToggle: UseCatalogFiltersResult['handleCityToggle']
  handleCategoryToggle: UseCatalogFiltersResult['handleCategoryToggle']
  handleSubcategoryToggle: UseCatalogFiltersResult['handleSubcategoryToggle']
  handleResetFilters: UseCatalogFiltersResult['handleResetFilters']

  // Для CatalogSections
  sections: CatalogSection[]
  toggleSection: (sectionId: CatalogSectionId) => void
  isRecommendedLoading: boolean
  setRecommendedLoadMoreElement: (element: HTMLDivElement | null) => void

  // Для FiltersResult
  sortedCatalogUsers: CatalogCardData[]
  activeFilters: ActiveFilter[]
  resultCount: number
  isSortedByNewest: boolean
  handleRemoveFilter: UseCatalogFiltersResult['handleRemoveFilter']
  handleSortToggle: () => void

  // Для CatalogSections и FiltersResult
  handleFavoriteToggle: (userId: string) => void
}

export function useCatalogPage(): UseCatalogPageResult {
  // #region Подготовка данных карточек и состояния каталога
  // Загружаем данные, собираем карточки и добавляем состояние избранного
  // Такую же подготовку можно использовать для «Похожих предложений» на SkillPage и масшабирования приложения(новых секций)
  // Эту подготовку можно вынести в общий хук для «Похожих предложений» на SkillPage

  // 1. Загружаем и получаем пользователей, навыки, города и категории из Redux
  const catalogData = useAppData()

  // 2. Получаем выбранные фильтры и функции для их изменения
  const {
    filters,
    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,
    handleRemoveFilter,
  } = useCatalogFilters()

  // 3. Получаем строку поиска из URL
  const searchQuery = useSearchQuery()
  // 4. Проверяем, авторизован ли пользователь
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // 5. Получаем избранное текущего пользователя из Redux и функцию переключения
  const { likedUserIds, toggleFavoriteUser } = useFavoriteUsers(isAuthenticated)
  // 6. Храним режим сортировки результатов: true — по новизне, false — по популярности
  const [isSortedByNewest, setIsSortedByNewest] = useState(false)

  // 7. Проверяем, введён ли непустой поисковый запрос
  const isSearchActive = searchQuery.trim() !== ''

  // 8. Собираем подкатегории всех категорий в один массив для buildCatalogUser
  const allSubcategories = useMemo(() => {
    if (!catalogData.categories) return []

    return catalogData.categories.flatMap((category) =>
      Array.isArray(category.subcategories) ? category.subcategories : [],
    )
  }, [catalogData.categories])

  // 9. Собираем данные карточек: пользователь, город и списки навыков
  const catalogUsers = useMemo(
    () =>
      (catalogData.users ?? [])
        .map((user) =>
          buildCatalogUser(
            user,
            catalogData.skills ?? [],
            catalogData.cities ?? [],
            allSubcategories,
            catalogData.categories ?? [],
          ),
        )
        .filter(({ teachSkills, learnSkills }) => teachSkills.length > 0 || learnSkills.length > 0),
    [
      catalogData.users,
      catalogData.skills,
      catalogData.cities,
      allSubcategories,
      catalogData.categories,
    ],
  )

  // 10. Добавляем состояние избранного и счётчик лайков для секций и результатов поиска
  const withFavoritesCatalogUsers = useMemo(
    () => addFavoriteData(catalogUsers, likedUserIds ?? []),
    [catalogUsers, likedUserIds],
  )
  // #endregion

  // 11. Применяем фильтры к карточкам; при активном поиске фильтры пропускаем
  const filteredCatalogUsers = useMemo(() => {
    if (isSearchActive) return withFavoritesCatalogUsers
    return filterCatalogUsers(withFavoritesCatalogUsers, filters)
  }, [withFavoritesCatalogUsers, filters, isSearchActive])

  // 12. Отбираем карточки по строке поиска
  const searchFilteredUsers = useMemo(
    () => filterCatalogUsersBySearch(filteredCatalogUsers, searchQuery),
    [filteredCatalogUsers, searchQuery],
  )

  // 13. Сортируем результаты по выбранному режиму "Сначала новые" или "Сначала популярные"
  const sortedCatalogUsers = useMemo(() => {
    if (searchFilteredUsers.length === 0) return []

    if (isSortedByNewest) {
      return sortCatalogUsersByNewestSkill(searchFilteredUsers)
    }

    return sortCatalogUsersByPopularity(searchFilteredUsers)
  }, [searchFilteredUsers, isSortedByNewest])

  // 14. Из всех карточек пункта 10 формируем секции «Популярное», «Новое» и «Рекомендуем» и управление их отображением
  const { sections, isRecommendedLoading, setRecommendedLoadMoreElement, toggleSection } =
    useCatalogSections(withFavoritesCatalogUsers)

  // 15. Готовим метки выбранных фильтров для отображения над результатами
  const activeFilters = useMemo(
    () => buildActiveFilters(filters, catalogData.cities ?? [], catalogData.categories ?? []),
    [catalogData.categories, catalogData.cities, filters],
  )

  // 16. Определяем, показывать результаты поиска/фильтров или обычные секции
  const hasActiveFilters = isSearchActive || countActiveFilters(filters) > 0

  // 17. Переключаем режим сортировки при нажатии на кнопку
  const handleSortToggle = () => {
    setIsSortedByNewest((isNewest) => !isNewest)
  }

  // 18. Передаём CatalogPage готовые данные, состояния и обработчики
  return {
    // Для CatalogPage
    errorMessage: catalogData.errorMessage ?? null,
    hasActiveFilters,

    // Для FiltersBar
    filters,
    categories: catalogData.categories ?? [],
    cities: catalogData.cities ?? [],
    isSearchActive,
    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,

    // Для CatalogSections
    sections,
    toggleSection,
    isRecommendedLoading,
    setRecommendedLoadMoreElement,

    // Для FiltersResult
    sortedCatalogUsers,
    activeFilters,
    resultCount: searchFilteredUsers.length,
    isSortedByNewest,
    handleRemoveFilter,
    handleSortToggle,

    // Для CatalogSections и FiltersResult
    handleFavoriteToggle: toggleFavoriteUser,
  }
}
