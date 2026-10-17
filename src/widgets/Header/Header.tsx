import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { SearchSkills } from '@/features/search-skills'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Logo } from '@/shared/ui/Logo'
import { Avatar } from '@/shared/ui/Avatar'
import { Popover } from '@/shared/ui/Popover'
import { useLogout } from '@/features/auth'

import chevronDownIcon from '@/shared/assets/icons/chevron-down.svg'
import moonIcon from '@/shared/assets/icons/moon.svg'
import bellIcon from '@/shared/assets/icons/bell.svg'
import heartIcon from '@/shared/assets/icons/heart.svg'
import logoutIcon from '@/shared/assets/icons/logout.svg'

import { CategoryPopover } from '@/entities/category/ui/CategoryPopover'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectIsAuthenticated, selectCurrentUserName } from '@/store/selectors/userSelectors'
import { setRegistrationSource } from '@/features/registration'

import styles from './Header.module.css'

export function Header() {
  const navigate = useNavigate()
  const logoutHandler = useLogout()
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categories.items)

  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userName = useAppSelector(selectCurrentUserName)

  const currentUser = useAppSelector((state) => {
    const userId = state.users.currentUserId
    return state.users.items.find((u) => u.id === userId) || null
  })

  const closePopover = () => {
    const event = new MouseEvent('pointerdown', { bubbles: true })
    document.dispatchEvent(event)
  }

  const handleProfileClick = () => {
    closePopover()
    navigate('/profile')
  }

  const handleLogoutClick = () => {
    closePopover()
    logoutHandler()
  }

  const handleRegisterClick = () => {
    dispatch(
      setRegistrationSource({
        from: 'header',
        skillId: null,
        backgroundLocation: '/',
      }),
    )
  }

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
              <div className={styles.iconsGroup}>
                <IconButton
                  src={moonIcon}
                  disabled
                  ariaLabel="Переключить тему"
                  onClick={() => console.log('Смена темы')}
                />
                <IconButton src={bellIcon} ariaLabel="Уведомления" onClick={() => {}} />
                <IconButton src={heartIcon} ariaLabel="Избранное" onClick={() => {}} />
              </div>

              <Popover
                align="right"
                padding="0"
                trigger={
                  <button type="button" className={styles.profileTrigger}>
                    <span className={styles.userName}>{userName || 'Пользователь'}</span>
                    <Avatar src={currentUser?.avatarUrl || ''} name={userName || 'Пользователь'} />
                  </button>
                }
              >
                <div className={styles.profileMenu}>
                  <button
                    type="button"
                    className={styles.profileMenuItem}
                    onClick={handleProfileClick}
                  >
                    <span>Личный кабинет</span>
                  </button>

                  <button
                    type="button"
                    className={clsx(styles.profileMenuItem, styles.profileMenuItemDanger)}
                    onClick={handleLogoutClick}
                  >
                    <span>Выйти из аккаунта</span>
                    <img
                      src={logoutIcon}
                      alt=""
                      aria-hidden="true"
                      className={styles.profileMenuIcon}
                    />
                  </button>
                </div>
              </Popover>
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

              <Link to="/register" onClick={handleRegisterClick} className={styles.authLink}>
                <Button variant="primary">Зарегистрироваться</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
