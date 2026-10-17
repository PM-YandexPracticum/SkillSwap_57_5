import type { Skill } from '@/entities/skill'
import type { User } from '@/entities/user'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { FavoriteButton } from '@/features/favorite-user'

import shareIcon from '@/shared/assets/icons/share.svg'
import optionIcon from '@/shared/assets/icons/option.svg'

import { Gallery } from '@/shared/ui/Gallery'
import styles from './SkillInfo.module.css'

interface SkillInfoProps {
  skill: Skill
  author: User
  categoryName: string
  subcategoryName: string
  isFavorite: boolean
  isAuthenticated: boolean
  onFavoriteToggle?: () => void
  onExchange: () => void
}

export function SkillInfo({
  skill,
  author,
  categoryName,
  subcategoryName,
  isFavorite,
  isAuthenticated,
  onFavoriteToggle,
  onExchange,
}: SkillInfoProps) {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <FavoriteButton
          user={author}
          isFavorite={isFavorite}
          likeCount={author.likesCount}
          isAuthenticated={isAuthenticated}
          onToggle={onFavoriteToggle}
          showCount={false}
        />
        <IconButton
          src={shareIcon}
          ariaLabel="Поделиться"
          onClick={() => console.log('Поделиться')}
        />
        <IconButton src={optionIcon} ariaLabel="Опции" onClick={() => console.log('Опции')} />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>{skill.title}</h1>
            <p className={styles.category}>
              {categoryName} / {subcategoryName}
            </p>
            <p className={styles.description}>{skill.description}</p>
          </div>
          <Button className={styles.button} onClick={onExchange}>
            Предложить обмен
          </Button>
        </div>

        <div className={styles.gallery}>
          <Gallery imageUrls={skill.imageUrls} />
        </div>
      </div>
    </section>
  )
}
