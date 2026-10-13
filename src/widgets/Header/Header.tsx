import { Link } from 'react-router-dom'
import { SearchSkills } from '@/features/search-skills'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Logo } from '@/shared/ui/Logo'
import { Avatar } from '@/shared/ui/Avatar'

// Импортируем иконки строго по распутанным и проверенным именам файлов в assets/icons
import chevronDownIcon from '@/shared/assets/icons/chevron-down.svg'
import moonIcon from '@/shared/assets/icons/moon.svg'
import bellIcon from '@/shared/assets/icons/bell.svg' 
import heartIcon from '@/shared/assets/icons/heart.svg' 

import { CategoryPopover } from '@/entities/category/ui/CategoryPopover'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated, selectCurrentUserName } from '@/store/selectors/userSelectors'

import styles from './Header.module.css'

export function Header() {
  const categories = useAppSelector((state) => state.categories.items)
  
  // Используем только готовые типизированные хуки из проекта строго по ТЗ
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userName = useAppSelector(selectCurrentUserName)

  // Получаем объект текущего пользователя для безопасного извлечения аватарки
  const currentUser = useAppSelector((state) => {
    const userId = state.users.currentUserId
    return state.users.items.find((u) => u.id === userId) || null
  })

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Logo />

          <Link to="/about" className={styles.aboutLinkHeader}>
            О проекте
          </Link>

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
          {isAuthenticated ? (
            <div className={styles.userSection}>
              {/* Группа иконок из Figma: Луна -> Колокольчик -> Сердечко (каждая в IconButton) */}
              <div className={styles.iconsGroup}>
                <IconButton
                  src={moonIcon}
                  disabled
                  ariaLabel="Переключить тему"
                  onClick={() => console.log('Смена темы')}
                />
                <IconButton
                  src={bellIcon}
                  ariaLabel="Уведомления"
                  onClick={() => {}}
                />
                <IconButton
                  src={heartIcon}
                  ariaLabel="Избранное"
                  onClick={() => {}}
                />
              </div>
              
              {/* Общий button для последующей реализации поповера. Имя строго слева от аватарки */}
              <button type="button" className={styles.profileTrigger}>
                <span className={styles.userName}>{userName || 'Пользователь'}</span>
                <Avatar src={currentUser?.avatarUrl || ''} name={userName || 'Пользователь'} />
              </button>
            </div>
          ) : (
            <div className={styles.authButtonSection}>
              <IconButton
                src={moonIcon}
                disabled
                ariaLabel="Переключить тему"
                onClick={() => console.log('Смена темы')}
              />
              <Link to="/login" className={styles.authLink}>
                <Button variant="secondary">Войти</Button>
              </Link>

              <Link to="/register" className={styles.authLink}>
                <Button variant="primary">Зарегистрироваться</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}