import { useMemo, useState } from 'react'

import {
  buildActiveFilters,
  countActiveFilters,
  filterCatalogUsers,
  useCatalogFilters,
  type ActiveFilter,
  type UseCatalogFiltersResult,
} from '@/features/filter-catalog'

import { useFavoriteUsers } from '@/features/favorite-user'
import { addFavoriteData } from '../lib/addFavoriteData'

import { filterCatalogUsersBySearch, useSearchQuery } from '@/features/search-skills'
import type { City } from '@/entities/city'
import type { SkillCategory } from '@/entities/category'

import { buildCatalogUsers } from '../lib/buildCatalogUsers'
import {
  sortCatalogUsersByNewestSkill,
  sortCatalogUsersByPopularity,
} from '../lib/sortCatalogUsers'

import { useCatalogData } from './useCatalogData'
import { useCatalogSections } from './useCatalogSections'
import type { CatalogCardData, CatalogSection, CatalogSectionId } from './types'

interface UseCatalogPageResult {
  filters: UseCatalogFiltersResult['filters']
  categories: SkillCategory[]
  cities: City[]
  activeFilters: ActiveFilter[]
  isAuthenticated: boolean
  sections: CatalogSection[]
  isRecommendedLoading: boolean
  setRecommendedLoadMoreElement: (element: HTMLDivElement | null) => void
  toggleSection: (sectionId: CatalogSectionId) => void
  filteredUsers: CatalogCardData[]
  resultCount: number
  isSortedByNewest: boolean
  hasActiveFilters: boolean
  isSearchActive: boolean
  isLoading: boolean
  errorMessage: string | null
  handleModeChange: UseCatalogFiltersResult['handleModeChange']
  handleGenderChange: UseCatalogFiltersResult['handleGenderChange']
  handleCityToggle: UseCatalogFiltersResult['handleCityToggle']
  handleCategoryToggle: UseCatalogFiltersResult['handleCategoryToggle']
  handleSubcategoryToggle: UseCatalogFiltersResult['handleSubcategoryToggle']
  handleResetFilters: UseCatalogFiltersResult['handleResetFilters']
  handleRemoveFilter: UseCatalogFiltersResult['handleRemoveFilter']
  handleSortToggle: () => void
  handleFavoriteToggle: (userId: string) => void
}

export function useCatalogPage(): UseCatalogPageResult {
  // #region Подготовка данных карточек и состояния каталога
  // Загружаем данные, собираем карточки и добавляем состояние избранного
  // Такую же подготовку можно использовать для «Похожих предложений» на SkillPage и масшабирования приложения(новых секций)
  // Эту подготовку можно вынести в общий хук для «Похожих предложений» на SkillPage

  // 1. Загружаем и получаем пользователей, навыки, города и категории из Redux
  const catalogData = useCatalogData()

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
  // 4. Временная заглушка авторизации: кнопки избранного доступны всем
  const isAuthenticated = true

  // 5. Получаем ID избранных пользователей из localStorage и функцию переключения
  const { likedUserIds, toggleFavoriteUser } = useFavoriteUsers(isAuthenticated)
  // 6. Храним режим сортировки результатов: true — по новизне, false — по популярности
  const [isSortedByNewest, setIsSortedByNewest] = useState(false)

  // 7. Проверяем, введён ли непустой поисковый запрос
  const isSearchActive = searchQuery.trim() !== ''

  // 8. Собираем подкатегории всех категорий в один массив для buildCatalogUsers
  const allSubcategories = useMemo(() => {
    if (!catalogData.categories) return []

    return catalogData.categories.flatMap((cat) =>
      Array.isArray(cat.subcategories) ? cat.subcategories : [],
    )
  }, [catalogData.categories])

  // 9. Собираем данные карточек: пользователь, город и списки навыков
  const catalogUsers = useMemo(
    () =>
      buildCatalogUsers(
        catalogData.users ?? [],
        catalogData.skills ?? [],
        catalogData.cities ?? [],
        allSubcategories,
        catalogData.categories ?? [],
      ),
    [
      catalogData.users,
      catalogData.skills,
      catalogData.cities,
      allSubcategories,
      catalogData.categories,
    ],
  )

  // 10. Добавляем состояние избранного и счётчик лайков для секций и результатов поиска
  const favoriteCatalogUsers = useMemo(
    () => addFavoriteData(catalogUsers, likedUserIds ?? []),
    [catalogUsers, likedUserIds],
  )
  // #endregion

  // 11. Применяем фильтры к карточкам; при активном поиске фильтры пропускаем
  const filteredCatalogUsers = useMemo(() => {
    if (isSearchActive) return favoriteCatalogUsers
    return filterCatalogUsers(favoriteCatalogUsers, filters)
  }, [favoriteCatalogUsers, filters, isSearchActive])

  // 12. Отбираем карточки по строке поиска
  const searchFilteredUsers = useMemo(
    () => filterCatalogUsersBySearch(filteredCatalogUsers, searchQuery),
    [filteredCatalogUsers, searchQuery],
  )

  // 13. Сортируем результаты по выбранному режиму "Сначала новые" или "Сначала популярные"
  const filteredUsers = useMemo(() => {
    if (searchFilteredUsers.length === 0) return []

    if (isSortedByNewest) {
      return sortCatalogUsersByNewestSkill(searchFilteredUsers)
    }

    return sortCatalogUsersByPopularity(searchFilteredUsers)
  }, [searchFilteredUsers, isSortedByNewest])

  // 14. Из всех карточек пункта 10 формируем секции «Популярное», «Новое» и «Рекомендуем» и управление их отображением
  const { sections, isRecommendedLoading, setRecommendedLoadMoreElement, toggleSection } =
    useCatalogSections(favoriteCatalogUsers)

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
    filters,
    categories: catalogData.categories ?? [],
    cities: catalogData.cities ?? [],
    activeFilters,
    isAuthenticated,
    sections,
    setRecommendedLoadMoreElement,
    toggleSection,
    filteredUsers,
    // Количество найденных карточек после поиска и фильтров
    resultCount: searchFilteredUsers.length,
    isSortedByNewest,
    hasActiveFilters,
    isSearchActive,
    isLoading: catalogData.isLoading ?? false,
    errorMessage: catalogData.errorMessage ?? null,
    isRecommendedLoading,
    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,
    handleRemoveFilter,
    handleSortToggle,
    handleFavoriteToggle: toggleFavoriteUser,
  }
}
