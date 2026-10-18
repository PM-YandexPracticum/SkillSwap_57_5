import type {
  ActiveFilter,
} from '@/features/filter-catalog'

import type {
  CatalogCardData,
} from '@/widgets/UserCard'

import { UserCard } from '@/widgets/UserCard'

import sortIcon from '@/shared/assets/icons/sort.svg'

import styles from './FiltersResult.module.css'

interface FiltersResultProps {
  activeFilters: ActiveFilter[]
  users: CatalogCardData[]
  resultCount: number
  isSortedByNewest: boolean
  onRemoveFilter: (filter: ActiveFilter) => void
  onSortToggle: () => void
  onFavoriteToggle: (userId: string) => void
}

export function FiltersResult({
  activeFilters,
  users,
  resultCount,
  isSortedByNewest,
  onRemoveFilter,
  onSortToggle,
  onFavoriteToggle,
}: FiltersResultProps) {
  return (
    <div className={styles.result}>
      <div className={styles.activeFilters}>
        {activeFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={styles.filterChip}
            onClick={() => onRemoveFilter(filter)}
            aria-label={`Убрать фильтр ${filter.label}`}
          >
            <span>{filter.label}</span>

            <span
              className={styles.removeIcon}
              aria-hidden="true"
            >
              ×
            </span>
          </button>
        ))}
      </div>

      <div className={styles.resultHead}>
        <h1 className={styles.resultTitle}>
          Подходящие предложения: {resultCount}
        </h1>

        <button
          type="button"
          className={styles.sortButton}
          onClick={onSortToggle}
        >
          <img
            src={sortIcon}
            className={styles.sortIcon}
            alt=""
            aria-hidden="true"
          />

          <span>
            {isSortedByNewest
              ? 'Сначала популярные'
              : 'Сначала новые'}
          </span>
        </button>
      </div>

      {users.length > 0 ? (
        <ul className={styles.cardsGrid}>
          {users.map((catalogUser) => (
            <li
              key={catalogUser.user.id}
              className={styles.cardItem}
            >
              <UserCard
                user={catalogUser.user}
                cityName={catalogUser.cityName}
                teachSkills={catalogUser.teachSkills}
                learnSkills={catalogUser.learnSkills}
                isFavorite={catalogUser.isFavorite}
                likeCount={catalogUser.displayedLikeCount}
                onFavoriteToggle={() =>
                  onFavoriteToggle(catalogUser.user.id)
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>
          По выбранным фильтрам ничего не найдено
        </p>
      )}
    </div>
  )
}
