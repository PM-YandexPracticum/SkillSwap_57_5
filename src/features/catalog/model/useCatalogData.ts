import { useEffect } from 'react'

import { loadCategories } from '@/store/slices/categoriesSlice'
import { loadCities } from '@/store/slices/citiesSlice'
import { loadSkills } from '@/store/slices/skillsSlice'
import { loadUsers } from '@/store/slices/usersSlice'
import type { City } from '@/entities/city'
import type { Skill } from '@/entities/skill'
import type { SkillCategory } from '@/entities/category'
import type { User } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

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

  const cities = useAppSelector(
    (state) => state.cities.items,
  )
  const citiesStatus = useAppSelector(
    (state) => state.cities.status,
  )
  const citiesError = useAppSelector(
    (state) => state.cities.error,
  )

  const categories = useAppSelector(
    (state) => state.categories.items,
  )
  const categoriesStatus = useAppSelector(
    (state) => state.categories.status,
  )
  const categoriesError = useAppSelector(
    (state) => state.categories.error,
  )

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
    if (citiesStatus === 'idle') {
      dispatch(loadCities())
    }
  }, [dispatch, citiesStatus])

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(loadCategories())
    }
  }, [dispatch, categoriesStatus])

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
