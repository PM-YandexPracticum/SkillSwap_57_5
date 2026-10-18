import { useCatalogPage } from '../model/useCatalogPage'

import { CatalogSections } from './CatalogSections'
import { FiltersBar } from '@/widgets/FiltersBar'
import { FiltersResult } from './FiltersResult'

import styles from './CatalogPage.module.css'
import { Loader } from '@/shared/ui/Loader'

export default function CatalogPage() {
  const {
    // Для CatalogPage
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

    // Для CatalogSections
    sections,
    toggleSection,
    isRecommendedLoading,
    setRecommendedLoadMoreElement,

    // Для FiltersResult
    sortedCatalogUsers,
    activeFilters,
    resultCount,
    isSortedByNewest,
    handleRemoveFilter,
    handleSortToggle,

    // Для CatalogSections и FiltersResult
    handleFavoriteToggle,
  } = useCatalogPage()

  if (isLoading) {
    return (
      <main className={styles.page}>
        <Loader text="Загружаем каталог навыков" />
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
          <CatalogSections
            sections={sections}
            isRecommendedLoading={isRecommendedLoading}
            setRecommendedLoadMoreElement={setRecommendedLoadMoreElement}
            onToggleSection={toggleSection}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
      </div>
    </main>
  )
}
