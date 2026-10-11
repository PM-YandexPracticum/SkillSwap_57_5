import { useEffect } from 'react'

import { loadCategories } from './slices/categoriesSlice'
import { loadCities } from './slices/citiesSlice'
import { loadSkills } from './slices/skillsSlice'
import { loadUsers } from './slices/usersSlice'
import type { City } from '@/entities/city'
import type { Skill } from '@/entities/skill'
import type { SkillCategory } from '@/entities/category'
import type { User } from '@/entities/user'
import { useAppDispatch, useAppSelector } from './hooks'

interface AppData {
  users: User[]
  cities: City[]
  categories: SkillCategory[]
  skills: Skill[]

  isLoading: boolean
  errorMessage: string | null
}

export function useAppData(): AppData {
  const dispatch = useAppDispatch()

  // Получаем навыки и загружаем их, если загрузка ещё не начиналась
  const skills = useAppSelector((state) => state.skills.items)
  const skillsStatus = useAppSelector((state) => state.skills.status)
  const skillsError = useAppSelector((state) => state.skills.error)
  useEffect(() => {
    if (skillsStatus === 'idle') {
      dispatch(loadSkills())
    }
  }, [dispatch, skillsStatus])

  // Получаем пользователей и при необходимости загружаем их
  const users = useAppSelector((state) => state.users.items)
  const usersStatus = useAppSelector((state) => state.users.status)
  const usersError = useAppSelector((state) => state.users.error)
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(loadUsers())
    }
  }, [dispatch, usersStatus])

  // Получаем города и при необходимости загружаем их
  const cities = useAppSelector((state) => state.cities.items)
  const citiesStatus = useAppSelector((state) => state.cities.status)
  const citiesError = useAppSelector((state) => state.cities.error)
  useEffect(() => {
    if (citiesStatus === 'idle') {
      dispatch(loadCities())
    }
  }, [dispatch, citiesStatus])

  // Получаем категории с подкатегориями и при необходимости загружаем их
  const categories = useAppSelector((state) => state.categories.items)
  const categoriesStatus = useAppSelector((state) => state.categories.status)
  const categoriesError = useAppSelector((state) => state.categories.error)
  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(loadCategories())
    }
  }, [dispatch, categoriesStatus])

  // Показываем загрузку, пока хотя бы один список ожидает запрос или загружается
  const isLoading =
    skillsStatus === 'idle' ||
    skillsStatus === 'loading' ||
    usersStatus === 'idle' ||
    usersStatus === 'loading' ||
    citiesStatus === 'idle' ||
    citiesStatus === 'loading' ||
    categoriesStatus === 'idle' ||
    categoriesStatus === 'loading'

  // Если запросы завершились с ошибками, показываем первую из них
  let errorMessage: string | null = null

  if (skillsStatus === 'failed') {
    errorMessage = skillsError ?? 'Не удалось загрузить навыки'
  } else if (usersStatus === 'failed') {
    errorMessage = usersError ?? 'Не удалось загрузить пользователей'
  } else if (citiesStatus === 'failed') {
    errorMessage = citiesError ?? 'Не удалось загрузить города'
  } else if (categoriesStatus === 'failed') {
    errorMessage = categoriesError ?? 'Не удалось загрузить категории'
  }

  return {
    users,
    cities,
    categories,
    skills,
    isLoading,
    errorMessage,
  }
}
