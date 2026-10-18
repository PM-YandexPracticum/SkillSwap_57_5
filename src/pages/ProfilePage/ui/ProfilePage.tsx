import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'

import RequestIcon from '@/shared/assets/icons/request.svg'
import MessageTextIcon from '@/shared/assets/icons/message-text.svg'
import LikeIcon from '@/shared/assets/icons/like.svg'
import IdeaIcon from '@/shared/assets/icons/idea.svg'
import UserIcon from '@/shared/assets/icons/user.svg'
import GalleryEditIcon from '@/shared/assets/icons/gallery-edit.svg'

import { Avatar } from '@/shared/ui/Avatar'
import { PersonalDataForm } from '@/widgets/PersonalData'

import { useAppSelector } from '@/store/hooks'
import { selectCurrentUser, selectCurrentUserName } from '@/store/selectors/userSelectors'

import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const currentUser = useAppSelector(selectCurrentUser)
  const userName = useAppSelector(selectCurrentUserName)
  const [avatarSrc, setAvatarSrc] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarSrc(reader.result)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <main className={styles.profile}>
      <aside className={styles.sidebar}>
        <nav className={styles.navigation} aria-label="Меню профиля">
          <button type="button" className={styles.navItem}>
            <img src={RequestIcon} alt="" className={styles.navIcon} />
            <span>Заявки</span>
          </button>

          <button type="button" className={styles.navItem}>
            <img src={MessageTextIcon} alt="" className={styles.navIcon} />
            <span>Мои обмены</span>
          </button>

          <Link to="/favorites" className={styles.navItem}>
            <img src={LikeIcon} alt="" className={styles.navIcon} />
            <span>Избранное</span>
          </Link>

          <button type="button" className={styles.navItem}>
            <img src={IdeaIcon} alt="" className={styles.navIcon} />
            <span>Мои навыки</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${styles.navItemActive}`}
            aria-current="page"
          >
            <img src={UserIcon} alt="" className={styles.navIcon} />
            <span>Личные данные</span>
          </button>
        </nav>
      </aside>

      <div className={styles.content}>
        <section className={styles.personalData}>
          <PersonalDataForm key={currentUser?.id} />
        </section>

        <div className={styles.avatar}>
          <div className={styles.avatarContainer}>
            <Avatar
              src={avatarSrc || currentUser?.avatarUrl || ''}
              name={userName || 'Пользователь'}
              className={styles.avatarImage}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />

            <button
              type="button"
              className={styles.avatarEditButton}
              aria-label="Изменить фото"
              onClick={() => fileInputRef.current?.click()}
            >
              <img src={GalleryEditIcon} alt="" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
