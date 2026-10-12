import { UserCard } from '@/widgets/UserCard'

import styles from './FavoritesList.module.css'
import type { FavoritesListProps } from './types'

export function FavoritesList({
  items,
  title,
  isAuthenticated,
  onFavoriteToggle,
}: FavoritesListProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      {items.length > 0 ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.user.id} className={styles.item}>
              <UserCard
                user={item.user}
                cityName={item.cityName}
                teachSkills={item.teachSkills}
                learnSkills={item.learnSkills}
                isFavorite={item.isFavorite}
                likeCount={item.displayedLikeCount}
                isAuthenticated={isAuthenticated}
                onFavoriteToggle={() => onFavoriteToggle(item.user.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>В избранном пока ничего нет</p>
      )}
    </section>
  )
}