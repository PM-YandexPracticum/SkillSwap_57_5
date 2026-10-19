import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'

import RequestIcon from '@/shared/assets/icons/request.svg'
import MessageTextIcon from '@/shared/assets/icons/message-text.svg'
import LikeIcon from '@/shared/assets/icons/like.svg'
import IdeaIcon from '@/shared/assets/icons/idea.svg'
import UserIcon from '@/shared/assets/icons/user.svg'
import GalleryEditIcon from '@/shared/assets/icons/gallery-edit.svg'

import { Avatar } from '@/shared/ui/Avatar'
import { ProfileEditForm } from '@/widgets/ProfileEditForm'
import { useUpdateProfile } from '@/features/profile'

import { useAppSelector } from '@/store/hooks'
import { selectCurrentUserName } from '@/store/selectors/userSelectors'

import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { currentUser, errors, submitProfileUpdate, avatarFile, handleAvatarChange } =
    useUpdateProfile()

  const userName = useAppSelector(selectCurrentUserName)

  const [avatarSrc, setAvatarSrc] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      handleAvatarChange(file)
    }

    // Позволяем повторно выбрать тот же файл
    event.target.value = ''
  }

  // Показываем выбранное фото и освобождаем временный URL при замене
  useEffect(() => {
    if (!avatarFile) {
      setAvatarSrc('')
      return
    }

    const previewUrl = URL.createObjectURL(avatarFile)
    setAvatarSrc(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [avatarFile])

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
            className={clsx(styles.navItem, styles.navItemActive)}
            aria-current="page"
          >
            <img src={UserIcon} alt="" className={styles.navIcon} />
            <span>Личные данные</span>
          </button>
        </nav>
      </aside>

      <div className={styles.content}>
        <section className={styles.personalData}>
          <ProfileEditForm
            key={currentUser?.id}
            currentUser={currentUser}
            errors={errors}
            onSubmit={submitProfileUpdate}
          />
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
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={handleAvatarInputChange}
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
          {errors.avatar && (
            <p className={styles.avatarError} role="alert">
              {errors.avatar}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
