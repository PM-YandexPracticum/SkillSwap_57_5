import { Link } from 'react-router-dom'
import { Logo } from '@/shared/ui/Logo'

import { CategoryPopover } from '@/entities/category'
import { useAppSelector } from '@/store/hooks'

import styles from './Footer.module.css'

export function Footer() {
  const categories = useAppSelector((state) => state.categories.items)

  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <Logo />
        <p className={styles.copyright}>SkillSwap - 2026</p>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navColumn}>
          <Link to="/about" className={styles.aboutLinkFooter}>
            О проекте
          </Link>

          <CategoryPopover
            categories={categories}
            placement="top"
            trigger={
              <button type="button" className={styles.skillsButton}>
                Все навыки
              </button>
            }
          />
        </div>

        <div className={styles.navColumn}>
          <a href="#">Контакты</a>
          <a href="#">Блог</a>
        </div>

        <div className={styles.navColumn}>
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Пользовательское соглашение</a>
        </div>
      </nav>
    </footer>
  )
}
