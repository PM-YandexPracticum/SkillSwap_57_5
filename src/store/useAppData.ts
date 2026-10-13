import type { City } from '@/entities/city'
import type { Skill } from '@/entities/skill'
import type { SkillCategory } from '@/entities/category'
import type { User } from '@/entities/user'
import { useAppSelector } from './hooks'

interface AppData {
  users: User[]
  cities: City[]
  categories: SkillCategory[]
  skills: Skill[]

  isLoading: boolean
  errorMessage: string | null
}

export function useAppData(): AppData {
  // Получаем навыки
  const skills = useAppSelector((state) => state.skills.items)
  const skillsStatus = useAppSelector((state) => state.skills.status)
  const skillsError = useAppSelector((state) => state.skills.error)

  // Получаем пользователей
  const users = useAppSelector((state) => state.users.items)
  const usersStatus = useAppSelector((state) => state.users.status)
  const usersError = useAppSelector((state) => state.users.error)

  // Получаем города
  const cities = useAppSelector((state) => state.cities.items)
  const citiesStatus = useAppSelector((state) => state.cities.status)
  const citiesError = useAppSelector((state) => state.cities.error)

  // Получаем категории с подкатегориями
  const categories = useAppSelector((state) => state.categories.items)
  const categoriesStatus = useAppSelector((state) => state.categories.status)
  const categoriesError = useAppSelector((state) => state.categories.error)

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