import { Logo } from '@/shared/ui/Logo'

import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Logo className={styles.logo}/>

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
            <a href="#">Политика конфиденциальностие</a>
            <a href="#">Пользовательское соглашение</a>
          </div>
        </nav>

        <p className={styles.copyright}>Skillswap - 2025</p>

      </div>



    </footer>
  )
}
