import { ButtonPrimary } from '@/shared/ui/ButtonPrimary'
import { ButtonSecondary } from '@/shared/ui/ButtonSecondary'
import { SearchSkills } from '@/features/search-skills'

import logo from '@/shared/assets/icons/Logo.png'
import chevronDownIcon from '@/shared/assets/icons/chevron-down.svg'
import moonIcon from '@/shared/assets/icons/moon.svg'

import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <button
            type="button"
            className={styles.logoButton}
            aria-label="SkillSwap"
          >
            <img
              src={logo}
              alt="SkillSwap"
              className={styles.logo}
            />
          </button>

          <button type="button" className={styles.skillsButton}>
            <span>Все навыки</span>

            <img
              src={chevronDownIcon}
              alt=""
              aria-hidden="true"
              className={styles.chevron}
            />
          </button>
        </div>

        <SearchSkills />

        <div className={styles.rightSection}>
          <button
            type="button"
            className={styles.themeButton}
            aria-label="Переключить тему"
          >
            <img
              src={moonIcon}
              alt=""
              aria-hidden="true"
              className={styles.themeIcon}
            />
          </button>

          <ButtonSecondary className={styles.loginButton}>
            Войти
          </ButtonSecondary>

          <ButtonPrimary className={styles.registerButton}>
            Зарегистрироваться
          </ButtonPrimary>
        </div>
      </div>
    </header>
  )
}
