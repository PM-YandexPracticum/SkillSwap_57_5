import { useFavoritesPage } from '../model/useFavoritesPage'
import { FavoritesList } from './FavoritesList'
import { FiltersResult } from './FiltersResult'
import { FiltersBar } from '@/widgets/FiltersBar'
import { Loader } from '@/shared/ui/Loader'

import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const {
    // Для страницы
    isLoading,
    errorMessage,
    hasActiveFilters,

    // Для FiltersBar
    filters,
    categories,
    cities,
    isSearchActive,
    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,

    // Для FavoritesList
    withFavoritesCatalogUsers,

    // Для FiltersResult
    sortedCatalogUsers,
    activeFilters,
    resultCount,
    isSortedByNewest,
    handleRemoveFilter,
    handleSortToggle,

    // Общие
    handleFavoriteToggle,
  } = useFavoritesPage()

  if (isLoading) {
    return (
      <main className={styles.page}>
        <Loader text="Загружаем избранное" />
      </main>
    )
  }

  if (errorMessage) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>{errorMessage}</p>
      </main>
    )
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
        disabled={isSearchActive}
      />

      <div className={styles.content}>
        {hasActiveFilters ? (
          <FiltersResult
            activeFilters={activeFilters}
            users={sortedCatalogUsers}
            resultCount={resultCount}
            isSortedByNewest={isSortedByNewest}
            onRemoveFilter={handleRemoveFilter}
            onSortToggle={handleSortToggle}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ) : (
          <FavoritesList
            items={withFavoritesCatalogUsers}
            title="Избранное"
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
      </div>
    </main>
  )
}
