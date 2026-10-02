import { useEffect, useState } from 'react'

import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import { fetchUsers } from '@/api/users'
import type { City, SkillCategory, User } from '@/shared/types'

type DataStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface CatalogData {
  users: User[]
  usersStatus: DataStatus
  usersError: string | null
  cities: City[]
  citiesStatus: DataStatus
  citiesError: string | null
  categories: SkillCategory[]
  categoriesStatus: DataStatus
  categoriesError: string | null
}

export function useCatalogData(): CatalogData {
  const [users, setUsers] = useState<User[]>([])
  const [usersStatus, setUsersStatus] = useState<DataStatus>('idle')
  const [usersError, setUsersError] = useState<string | null>(null)

  const [cities, setCities] = useState<City[]>([])
  const [citiesStatus, setCitiesStatus] = useState<DataStatus>('idle')
  const [citiesError, setCitiesError] = useState<string | null>(null)

  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [categoriesStatus, setCategoriesStatus] = useState<DataStatus>('idle')
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      setUsersStatus('loading')
      setUsersError(null)

      try {
        const loadedUsers = await fetchUsers()

        if (!isMounted) {
          return
        }

        setUsers(loadedUsers)
        setUsersStatus('succeeded')
      } catch {
        if (!isMounted) {
          return
        }

        setUsersStatus('failed')
        setUsersError('Не удалось загрузить пользователей')
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadCities() {
      setCitiesStatus('loading')
      setCitiesError(null)

      try {
        const loadedCities = await fetchCities()

        if (!isMounted) {
          return
        }

        setCities(loadedCities)
        setCitiesStatus('succeeded')
      } catch {
        if (!isMounted) {
          return
        }

        setCitiesStatus('failed')
        setCitiesError('Не удалось загрузить города')
      }
    }

    loadCities()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      setCategoriesStatus('loading')
      setCategoriesError(null)

      try {
        const loadedCategories = await fetchCategories()

        if (!isMounted) {
          return
        }

        setCategories(loadedCategories)
        setCategoriesStatus('succeeded')
      } catch {
        if (!isMounted) {
          return
        }

        setCategoriesStatus('failed')
        setCategoriesError('Не удалось загрузить категории')
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    users,
    usersStatus,
    usersError,
    cities,
    citiesStatus,
    citiesError,
    categories,
    categoriesStatus,
    categoriesError,
  }
}
