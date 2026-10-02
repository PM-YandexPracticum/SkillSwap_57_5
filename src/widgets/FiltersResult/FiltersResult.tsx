import type { ActiveFilter, CatalogUser } from '@/pages/CatalogPage/model/types'

import { SkillCard } from '@/widgets/SkillCard'

import sortIcon from '@/shared/assets/icons/sort.svg'

import styles from './FiltersResult.module.css'

interface FiltersResultProps {
  activeFilters: ActiveFilter[]
  users: CatalogUser[]
  isAuthenticated: boolean
  likedUserIds: string[]
  resultCount: number
  isSortedByNewest: boolean
  onRemoveFilter: (filter: ActiveFilter) => void
  onSortToggle: () => void
  onFavoriteToggle: (userId: string) => void
}

export function FiltersResult({
  activeFilters,
  users,
  isAuthenticated,
  likedUserIds,
  resultCount,
  isSortedByNewest,
  onRemoveFilter,
  onSortToggle,
  onFavoriteToggle,
}: FiltersResultProps) {
  const likedUserIdSet = new Set(likedUserIds)

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
            <span className={styles.removeIcon} aria-hidden="true">
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

          <span>{isSortedByNewest ? 'Сначала популярные' : 'Сначала новые'}</span>
        </button>
      </div>

      {users.length > 0 ? (
        <ul className={styles.cardsGrid}>
          {users.map(({ user, cityName, teachSkills, learnSkills }) => {
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
                  onFavoriteToggle={() => onFavoriteToggle(user.id)}
                />
              </li>
            )
          })}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>
          По выбранным фильтрам ничего не найдено
        </p>
      )}
    </div>
  )
}
