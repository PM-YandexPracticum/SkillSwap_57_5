import { useCatalogPage } from '@/features/catalog'

import { Catalog } from '@/widgets/Catalog'
import { FiltersBar } from '@/widgets/FiltersBar'
import { FiltersResult } from '@/widgets/FiltersResult'

import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const {
    filters,
    categories,
    cities,

    activeFilters,

    isAuthenticated,

    sections,
    setRecommendedLoadMoreElement,
    toggleSection,

    filteredUsers,
    resultCount,

    isSortedByNewest,
    hasActiveFilters,

    isLoading,
    errorMessage,
    isRecommendedLoading,

    handleModeChange,
    handleGenderChange,
    handleCityToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleResetFilters,
    handleRemoveFilter,
    handleSortToggle,
    handleFavoriteToggle,
  } = useCatalogPage()

  if (isLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>
          Загрузка...
        </p>
      </main>
    )
  }

  if (errorMessage) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>
          {errorMessage}
        </p>
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
        onCategoryToggle={
          handleCategoryToggle
        }
        onSubcategoryToggle={
          handleSubcategoryToggle
        }
        onReset={handleResetFilters}
      />

      <div className={styles.content}>
        {hasActiveFilters ? (
          <FiltersResult
            activeFilters={activeFilters}
            users={filteredUsers}
            isAuthenticated={
              isAuthenticated
            }
            resultCount={resultCount}
            isSortedByNewest={
              isSortedByNewest
            }
            onRemoveFilter={
              handleRemoveFilter
            }
            onSortToggle={
              handleSortToggle
            }
            onFavoriteToggle={
              handleFavoriteToggle
            }
          />
        ) : (
          <Catalog
            sections={sections}
            isAuthenticated={isAuthenticated}
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
