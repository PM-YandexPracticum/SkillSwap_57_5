import type {
  CatalogSection,
  CatalogSectionId,
} from '@/features/catalog'

import chevronDownIcon from '@/shared/assets/icons/chevron-down.svg'

import { SkillCard } from '@/widgets/SkillCard'

import styles from './Catalog.module.css'

interface CatalogProps {
  sections: CatalogSection[]
  isAuthenticated: boolean
  setRecommendedLoadMoreElement: (
    element: HTMLDivElement | null,
  ) => void
  onToggleSection: (sectionId: CatalogSectionId) => void
  onFavoriteToggle: (userId: string) => void
}

export function Catalog({
  sections,
  isAuthenticated,
  setRecommendedLoadMoreElement,
  onToggleSection,
  onFavoriteToggle,
}: CatalogProps) {
  return (
    <div className={styles.content}>
      {sections.map((section) => (
        <section
          className={styles.section}
          key={section.id}
        >
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              {section.title}
            </h2>

            {section.showAll && (
              <button
                className={styles.viewAllButton}
                type="button"
                onClick={() =>
                  onToggleSection(section.id)
                }
              >
                {section.isExpanded
                  ? 'Свернуть'
                  : 'Смотреть все'}

                <img
                  className={`${styles.chevronIcon} ${
                    section.isExpanded
                      ? styles.chevronIconExpanded
                      : ''
                  }`}
                  src={chevronDownIcon}
                  alt=""
                />
              </button>
            )}
          </div>

          <ul className={styles.cardsGrid}>
            {section.users.map((catalogUser) => (
              <li
                className={styles.cardItem}
                key={catalogUser.user.id}
              >
                <SkillCard
                  user={catalogUser.user}
                  cityName={catalogUser.cityName}
                  teachSkills={catalogUser.teachSkills}
                  learnSkills={catalogUser.learnSkills}
                  isFavorite={catalogUser.isFavorite}
                  likeCount={catalogUser.displayedLikeCount}
                  isAuthenticated={isAuthenticated}
                  onFavoriteToggle={() =>
                    onFavoriteToggle(
                      catalogUser.user.id,
                    )
                  }
                />
              </li>
            ))}
          </ul>

          {section.id === 'recommended' && (
            <div
              className={styles.loadMoreTrigger}
              ref={setRecommendedLoadMoreElement}
            />
          )}
        </section>
      ))}
    </div>
  )
}
