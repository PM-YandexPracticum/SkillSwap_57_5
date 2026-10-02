import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ButtonPrimary } from '@/shared/ui/ButtonPrimary'
import { ButtonSecondary } from '@/shared/ui/ButtonSecondary'

import logo from '@/shared/assets/icons/Logo.png'
import chevronDownIcon from '@/shared/assets/icons/chevron-down.svg'
import moonIcon from '@/shared/assets/icons/moon.svg'
import searchIcon from '@/shared/assets/icons/search.svg'

import { useDebounce } from '@/shared/hooks/useDebounce'

import styles from './Header.module.css'

export function Header() {
  const [searchParams, setSearchParams] = useSearchParams()

  const searchQueryFromUrl = searchParams.get('search') ?? ''

  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl)

  const debouncedSearchQuery = useDebounce(searchQuery)

  useEffect(() => {
    const normalizedSearchQuery = debouncedSearchQuery.trim()

    if (normalizedSearchQuery === '') {
      if (!searchParams.has('search')) {
        return
      }

      const nextSearchParams = new URLSearchParams(searchParams)
      nextSearchParams.delete('search')
      setSearchParams(nextSearchParams)
      return
    }

    if (searchParams.get('search') === normalizedSearchQuery) {
      return
    }

    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('search', normalizedSearchQuery)
    setSearchParams(nextSearchParams)
  }, [
    debouncedSearchQuery,
    searchParams,
    setSearchParams,
  ])

  useEffect(() => {
    setSearchQuery(searchQueryFromUrl)
  }, [searchQueryFromUrl])

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

        <div className={styles.searchWrapper}>
          <img
            src={searchIcon}
            alt=""
            aria-hidden="true"
            className={styles.searchIcon}
          />

          <input
            type="search"
            className={styles.searchInput}
            placeholder="Искать навык"
            aria-label="Поиск навыка"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

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
