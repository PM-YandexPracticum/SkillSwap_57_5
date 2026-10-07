import type { User } from '@/entities/user'
import { SkillTag, type Skill } from '@/entities/skill'
import { getAgeFromBirthDate } from '@/shared/lib/helpers'
import { Avatar } from '@/shared/ui/Avatar'

import styles from './SkillAuthor.module.css'

interface SkillAuthorProps {
  user: User
  cityName: string
  teachSkills: Skill[]
  learnSkills: Skill[]
}

function getAgeLabel(age: number): string {
  const lastTwoDigits = age % 100
  const lastDigit = age % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'лет'
  }

  if (lastDigit === 1) {
    return 'год'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года'
  }

  return 'лет'
}

export function SkillAuthor({ user, cityName, teachSkills, learnSkills }: SkillAuthorProps) {
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
