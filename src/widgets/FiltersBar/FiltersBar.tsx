import { useState } from 'react'

import type { Gender } from '@/entities/user'
import type { City } from '@/entities/city'
import type { SkillCategory } from '@/entities/category'

import { countActiveFilters, type CatalogFilters } from '@/features/filter-catalog'

import chevronDownIcon from '@/shared/assets/icons/chevron-down.svg'
import crossIcon from '@/shared/assets/icons/cross.svg'

import styles from './FiltersBar.module.css'

const INITIAL_VISIBLE_CITIES = 5

interface FiltersBarProps {
  filters: CatalogFilters
  categories: SkillCategory[]
  cities: City[]
  onModeChange: (mode: CatalogFilters['mode']) => void
  onGenderChange: (gender: Gender | null) => void
  onCityToggle: (cityId: string) => void
  onCategoryToggle: (categoryId: string) => void
  onSubcategoryToggle: (categoryId: string, subcategoryId: string) => void
  onReset: () => void
  disabled?: boolean
}

export function FiltersBar({
  filters,
  categories,
  cities,
  onModeChange,
  onGenderChange,
  onCityToggle,
  onCategoryToggle,
  onSubcategoryToggle,
  onReset,
  disabled = false,
}: FiltersBarProps) {
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([])

  const [areAllCitiesVisible, setAreAllCitiesVisible] = useState(false)

  const visibleCities = areAllCitiesVisible ? cities : cities.slice(0, INITIAL_VISIBLE_CITIES)

  const activeFiltersCount = countActiveFilters(filters)

  const handleCategoryExpandToggle = (categoryId: string) => {
    setExpandedCategoryIds((currentExpandedCategoryIds) => {
      if (currentExpandedCategoryIds.includes(categoryId)) {
        return currentExpandedCategoryIds.filter(
          (expandedCategoryId) => expandedCategoryId !== categoryId,
        )
      }

      return [...currentExpandedCategoryIds, categoryId]
    })
  }

  return (
    <aside className={`${styles.filters} ${disabled ? styles.filtersDisabled : ''}`}>
      <div className={styles.filtersHead}>
        <h2 className={styles.title}>
          {activeFiltersCount > 0 ? `Фильтры (${activeFiltersCount})` : 'Фильтры'}
        </h2>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            className={styles.resetButton}
            onClick={onReset}
            disabled={disabled}
          >
            <span>Сбросить</span>

            <img src={crossIcon} alt="" aria-hidden="true" />
          </button>
        )}
      </div>

      <fieldset className={styles.group} disabled={disabled}>
        <legend className={styles.legend}>Что показывать</legend>

        <div className={styles.optionList}>
          <label className={styles.option}>
            <input
              type="radio"
              name="skill-type"
              value="all"
              checked={filters.mode === 'all'}
              onChange={() => onModeChange('all')}
            />
            <span>Всё</span>
          </label>

          <label className={styles.option}>
            <input
              type="radio"
              name="skill-type"
              value="learn"
              checked={filters.mode === 'learn'}
              onChange={() => onModeChange('learn')}
            />
            <span>Хочу научиться</span>
          </label>

          <label className={styles.option}>
            <input
              type="radio"
              name="skill-type"
              value="teach"
              checked={filters.mode === 'teach'}
              onChange={() => onModeChange('teach')}
            />
            <span>Могу научить</span>
          </label>
        </div>
      </fieldset>

      <fieldset className={styles.group} disabled={disabled}>
        <legend className={styles.legend}>Навыки</legend>

        <div className={styles.categoryList}>
          {categories.map((category) => {
            const selectedCategory = filters.skillCategories.find(
              (skillCategory) => skillCategory.categoryId === category.id,
            )

            const isCategorySelected = Boolean(selectedCategory)

            const isCategoryExpanded = expandedCategoryIds.includes(category.id)

            return (
              <div key={category.id} className={styles.category}>
                <div className={styles.categoryRow}>
                  <label className={styles.option}>
                    <input
                      type="checkbox"
                      checked={isCategorySelected}
                      onChange={() => onCategoryToggle(category.id)}
                    />

                    <span>{category.name}</span>
                  </label>

                  <button
                    type="button"
                    className={`${styles.expandButton} ${
                      isCategoryExpanded ? styles.expandButtonExpanded : ''
                    }`}
                    onClick={() => handleCategoryExpandToggle(category.id)}
                    aria-expanded={isCategoryExpanded}
                    aria-label={
                      isCategoryExpanded
                        ? `Свернуть ${category.name}`
                        : `Развернуть ${category.name}`
                    }
                  >
                    <img
                      src={chevronDownIcon}
                      className={styles.chevron}
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {isCategoryExpanded && (
                  <div className={styles.subcategoryList}>
                    {category.subcategories.map((subcategory) => {
                      const isSubcategorySelected =
                        selectedCategory?.subcategoryIds.includes(subcategory.id) ?? false

                      return (
                        <label key={subcategory.id} className={styles.subcategoryOption}>
                          <input
                            type="checkbox"
                            checked={isSubcategorySelected}
                            onChange={() => onSubcategoryToggle(category.id, subcategory.id)}
                          />

                          <span>{subcategory.name}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </fieldset>

      <fieldset className={styles.group} disabled={disabled}>
        <legend className={styles.legend}>Пол автора</legend>

        <div className={styles.optionList}>
          <label className={styles.option}>
            <input
              type="radio"
              name="gender"
              value="all"
              checked={filters.gender === null}
              onChange={() => onGenderChange(null)}
            />

            <span>Любой</span>
          </label>

          <label className={styles.option}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={filters.gender === 'male'}
              onChange={() => onGenderChange('male')}
            />
            <span>Мужской</span>
          </label>

          <label className={styles.option}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={filters.gender === 'female'}
              onChange={() => onGenderChange('female')}
            />
            <span>Женский</span>
          </label>
        </div>
      </fieldset>

      <fieldset className={styles.group} disabled={disabled}>
        <legend className={styles.legend}>Город</legend>

        <div className={styles.optionList}>
          {visibleCities.map((city) => (
            <label key={city.id} className={styles.option}>
              <input
                type="checkbox"
                checked={filters.cityIds.includes(city.id)}
                onChange={() => onCityToggle(city.id)}
              />

              <span>{city.name}</span>
            </label>
          ))}
        </div>

        {cities.length > INITIAL_VISIBLE_CITIES && (
          <button
            type="button"
            className={styles.moreButton}
            onClick={() => setAreAllCitiesVisible((isVisible) => !isVisible)}
            disabled={disabled}
          >
            <span>{areAllCitiesVisible ? 'Свернуть' : 'Все города'}</span>

            <img
              src={chevronDownIcon}
              className={`${styles.moreButtonChevron} ${
                areAllCitiesVisible ? styles.moreButtonChevronExpanded : ''
              }`}
              alt=""
              aria-hidden="true"
            />
          </button>
        )}
      </fieldset>
    </aside>
  )
}
