import { ButtonPrimary } from '@/shared/ui/ButtonPrimary'
import type { Skill, User } from '@/shared/types'

import { FavoriteButton } from '@/features/favorite-user'
import { SkillTag } from '@/entities/skill'
import { UserAvatar } from '@/entities/user'

import styles from './SkillCard.module.css'

interface SkillCardProps {
  user: User
  cityName: string
  teachSkills: Skill[]
  learnSkills: Skill[]
  isFavorite?: boolean
  likeCount?: number
  isAuthenticated?: boolean
  onFavoriteToggle?: () => void
}

export function SkillCard({
  user,
  cityName,
  teachSkills,
  learnSkills,
  isFavorite = false,
  likeCount = user.likeCount,
  isAuthenticated = false,
  onFavoriteToggle,
}: SkillCardProps) {
  const visibleTeachSkills = teachSkills.slice(0, 1)
  const visibleLearnSkills = learnSkills.slice(0, 2)
  const additionalLearnSkillsCount =
    learnSkills.length - visibleLearnSkills.length

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <UserAvatar user={user} />

        <div className={styles.userColumn}>
          <FavoriteButton
            user={user}
            isFavorite={isFavorite}
            likeCount={likeCount}
            isAuthenticated={isAuthenticated}
            onToggle={onFavoriteToggle}
          />

          <div className={styles.userNameRow}>
            <h2 className={styles.name}>{user.name}</h2>

            <p className={styles.location}>
              {cityName}, {user.age} лет
            </p>
          </div>
        </div>
      </div>

      <div className={styles.skillsContent}>
        <div className={styles.skillsSection}>
          <h3 className={styles.skillsTitle}>Может научить:</h3>

          <div className={styles.skillsList}>
            {visibleTeachSkills.map((skill) => (
              <SkillTag key={skill.id} skill={skill} />
            ))}
          </div>
        </div>

        <div className={styles.skillsSection}>
          <h3 className={styles.skillsTitle}>Хочет научиться:</h3>

          <div className={styles.skillsList}>
            {visibleLearnSkills.map((skill) => (
              <SkillTag key={skill.id} skill={skill} />
            ))}

            {additionalLearnSkillsCount > 0 && (
              <span className={styles.additionalSkills}>
                +{additionalLearnSkillsCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <ButtonPrimary className={styles.detailsButton}>
        Подробнее
      </ButtonPrimary>
    </article>
  )
}
