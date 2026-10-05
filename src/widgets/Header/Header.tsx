import { SearchSkills } from '@/features/search-skills'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'

import logo from '@/shared/assets/icons/Logo.png'
import chevronDownIcon from '@/shared/assets/icons/chevron-down.svg'
import moonIcon from '@/shared/assets/icons/moon.svg'

import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <button type="button" className={styles.logoButton} aria-label="SkillSwap">
            <img src={logo} alt="SkillSwap" className={styles.logo} />
          </button>

          <button type="button" className={styles.skillsButton}>
            <span>Все навыки</span>

            <img src={chevronDownIcon} alt="" aria-hidden="true" className={styles.chevron} />
          </button>
        </div>

        <SearchSkills />

        <div className={styles.rightSection}>
          <IconButton src={moonIcon} ariaLabel="Переключить тему" onClick={() => {}}>
          </IconButton>
          <div className={styles.authButtonSection}>
            <Button variant="secondary">Войти</Button>

            <Button variant="primary">Зарегистрироваться</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
