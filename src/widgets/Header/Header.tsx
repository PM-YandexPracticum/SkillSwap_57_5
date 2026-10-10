import { Link } from 'react-router-dom'
import { SearchSkills } from '@/features/search-skills'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Logo } from '@/shared/ui/Logo'

import chevronDownIcon from '@/shared/assets/icons/chevron-down.svg'
import moonIcon from '@/shared/assets/icons/moon.svg'

import { CategoryPopover } from '@/entities/category/ui/CategoryPopover'
import { useAppSelector } from '@/store/hooks'

import styles from './Header.module.css'

export function Header() {
  const categories = useAppSelector((state) => state.categories.items)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Logo />

          <CategoryPopover
            categories={categories}
            trigger={
              <button type="button" className={styles.skillsButton}>
                <span>Все навыки</span>

                <img src={chevronDownIcon} alt="" aria-hidden="true" className={styles.chevron} />
              </button>
            }
          />
        </div>

        <SearchSkills />

        <div className={styles.rightSection}>
          <IconButton
            src={moonIcon}
            disabled
            ariaLabel="Переключить тему"
            onClick={() => console.log('Смена темы')}
          ></IconButton>
          <div className={styles.authButtonSection}>
            <Link to="/login" className={styles.authLink}>
              <Button variant="secondary">Войти</Button>
            </Link>

            <Link to="/register" className={styles.authLink}>
              <Button variant="primary">Зарегистрироваться</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
