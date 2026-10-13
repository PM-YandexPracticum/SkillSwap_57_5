import { Link } from 'react-router-dom'

import RequestIcon from '@/shared/assets/icons/request.svg'
import MessageTextIcon from '@/shared/assets/icons/message-text.svg'
import LikeIcon from '@/shared/assets/icons/like.svg'
import IdeaIcon from '@/shared/assets/icons/idea.svg'
import UserIcon from '@/shared/assets/icons/user.svg'

import { PersonalDataForm } from './PersonalDataForm/PersonalDataForm'
import { ProfileAvatar } from './ProfileAvatar/ProfileAvatar'

import styles from './ProfilePage.module.css'

export default function ProfilePage() {
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

          <Link to="/favourites" className={styles.navItem}>
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
          <PersonalDataForm />
        </section>

        <div className={styles.avatar}>
          <ProfileAvatar />
        </div>
      </div>
    </main>
  )
}
