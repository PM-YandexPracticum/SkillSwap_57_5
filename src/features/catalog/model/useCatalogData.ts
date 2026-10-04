import { useEffect, useState } from 'react'

import { fetchCategories } from '@/api/categories'
import { fetchCities } from '@/api/cities'
import { loadSkills } from '@/store/slices/skillsSlice'
import { loadUsers } from '@/store/slices/usersSlice'
import type { City } from '@/entities/city'
import type { Skill } from '@/entities/skill'
import type { SkillCategory } from '@/entities/category'
import type { User } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

type DataStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface CatalogData {
  users: User[]
  cities: City[]
  categories: SkillCategory[]
  skills: Skill[]

  isLoading: boolean
  errorMessage: string | null
}

export function useCatalogData(): CatalogData {
  const dispatch = useAppDispatch()

  const skills = useAppSelector(
    (state) => state.skills.items,
  )

  const skillsStatus = useAppSelector(
    (state) => state.skills.status,
  )

  const skillsError = useAppSelector(
    (state) => state.skills.error,
  )

  const users = useAppSelector(
    (state) => state.users.items,
  )

  const usersStatus = useAppSelector(
    (state) => state.users.status,
  )

  const usersError = useAppSelector(
    (state) => state.users.error,
  )

  const [cities, setCities] = useState<City[]>([])
  const [citiesStatus, setCitiesStatus] =
    useState<DataStatus>('idle')
  const [citiesError, setCitiesError] =
    useState<string | null>(null)

  const [categories, setCategories] = useState<
    SkillCategory[]
  >([])
  const [categoriesStatus, setCategoriesStatus] =
    useState<DataStatus>('idle')
  const [categoriesError, setCategoriesError] =
    useState<string | null>(null)

  useEffect(() => {
    if (skillsStatus === 'idle') {
      dispatch(loadSkills())
    }
  }, [dispatch, skillsStatus])

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(loadUsers())
    }
  }, [dispatch, usersStatus])

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
        setCitiesError(
          'Не удалось загрузить города',
        )
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
        const loadedCategories =
          await fetchCategories()

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
        setCategoriesError(
          'Не удалось загрузить категории',
        )
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const isLoading =
    skillsStatus === 'loading' ||
    usersStatus === 'loading' ||
    citiesStatus === 'loading' ||
    categoriesStatus === 'loading'

  const errorMessage =
    skillsStatus === 'failed'
      ? skillsError ?? 'Не удалось загрузить навыки'
      : usersStatus === 'failed'
        ? usersError ??
          'Не удалось загрузить пользователей'
        : citiesStatus === 'failed'
          ? citiesError ??
            'Не удалось загрузить города'
          : categoriesStatus === 'failed'
            ? categoriesError ??
              'Не удалось загрузить категории'
            : null

  return {
    users,
    cities,
    categories,
    skills,
    isLoading,
    errorMessage,
  }
}
