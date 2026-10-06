import { Logo } from '@/shared/ui/Logo'

import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <Logo />
        <p className={styles.copyright}>SkillSwap - 2026</p>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navColumn}>
          <a href="#">О проекте</a>
          <a href="#">Все навыки</a>
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
