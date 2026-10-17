import type { Skill } from '@/entities/skill'
import type { User } from '@/entities/user'
import { Button } from '@/shared/ui/Button'
import { FavoriteButton } from '@/features/favorite-user'
import { SkillTag } from '@/entities/skill'
import { Avatar } from '@/shared/ui/Avatar'
import { useNavigate } from 'react-router-dom'

import { getAgeFromBirthDate } from '@/shared/lib/helpers'
import styles from './UserCard.module.css'

interface UserCardProps {
  user: User
  cityName: string
  teachSkills: Skill[]
  learnSkills: Skill[]
  isFavorite?: boolean
  likeCount?: number
  onFavoriteToggle?: () => void
}

export function UserCard({
  user,
  cityName,
  teachSkills,
  learnSkills,
  isFavorite = false,
  likeCount = typeof user.likesCount === 'number' ? user.likesCount : 0,
  onFavoriteToggle,
}: UserCardProps) {
  const navigate = useNavigate()
  const visibleTeachSkills = teachSkills.slice(0, 1)
  const visibleLearnSkills = learnSkills.slice(0, 2)
  const additionalLearnSkillsCount = learnSkills.length - visibleLearnSkills.length

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Avatar name={user.name} src={user.avatarUrl} />

        <div className={styles.userColumn}>
          <FavoriteButton
            user={user}
            isFavorite={isFavorite}
            likeCount={likeCount}
            onToggle={onFavoriteToggle}
          />

          <div className={styles.userNameRow}>
            <h2 className={styles.name}>{user.name}</h2>
            <p className={styles.location}>
              {cityName}, {getAgeFromBirthDate(user.birthDate)} лет
            </p>
          </div>
        </div>
      </div>

      <div className={styles.skillsContent}>
        {visibleTeachSkills.length > 0 && (
          <div className={styles.skillsSection}>
            <h3 className={styles.skillsTitle}>Может научить:</h3>
            <div className={styles.skillsList}>
              {visibleTeachSkills.map((skill) => (
                <SkillTag key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        )}

        {(visibleLearnSkills.length > 0 || additionalLearnSkillsCount > 0) && (
          <div className={styles.skillsSection}>
            <h3 className={styles.skillsTitle}>Хочет научиться:</h3>
            <div className={styles.skillsList}>
              {visibleLearnSkills.map((skill) => (
                <SkillTag key={skill.id} skill={skill} />
              ))}

              {additionalLearnSkillsCount > 0 && (
                <span className={styles.additionalSkills}>+{additionalLearnSkillsCount}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <Button
        variant="primary"
        className={styles.detailsButton}
        onClick={() => {
          if (visibleTeachSkills.length > 0) {
            navigate(`/skill/${visibleTeachSkills[0].id}`)
          }
        }}
      >
        Подробнее
      </Button>
    </article>
  )
}
