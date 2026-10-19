import type { User } from '@/entities/user'
import { SkillTag, type Skill } from '@/entities/skill'
import { getAgeFromBirthDate, getAgeLabel } from '@/shared/lib/helpers'
import { Avatar } from '@/shared/ui/Avatar'

import styles from './SkillAuthorCard.module.css'

interface SkillAuthorCardProps {
  user: User
  cityName: string
  teachSkills: Skill[]
  learnSkills: Skill[]
}

export function SkillAuthorCard({
  user,
  cityName,
  teachSkills,
  learnSkills,
}: SkillAuthorCardProps) {
  const age = getAgeFromBirthDate(user.birthDate)

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Avatar src={user.avatarUrl} name={user.name} className={styles.avatar} />

        <div className={styles.userInfo}>
          <h2 className={styles.name}>{user.name}</h2>
          <p className={styles.location}>
            {cityName}, {age} {getAgeLabel(age)}
          </p>
        </div>
      </div>

      {user.about && <p className={styles.about}>{user.about}</p>}

      {teachSkills.length > 0 && (
        <section className={styles.skillsSection}>
          <h3 className={styles.skillsTitle}>Может научить</h3>
          <div className={styles.skillsList}>
            {teachSkills.map((skill) => (
              <SkillTag key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {learnSkills.length > 0 && (
        <section className={styles.skillsSection}>
          <h3 className={styles.skillsTitle}>Хочет научиться</h3>
          <div className={styles.skillsList}>
            {learnSkills.map((skill) => (
              <SkillTag key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
