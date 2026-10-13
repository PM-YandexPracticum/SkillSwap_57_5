import type { AppDispatch } from '@/store'
import { getAuthUser } from '@/features/auth'
import { loadUsers, setSession } from '@/store/slices/usersSlice'
import { loadSkills } from '@/store/slices/skillsSlice'
import { loadCities } from '@/store/slices/citiesSlice'
import { loadCategories } from '@/store/slices/categoriesSlice'

let isAppInitialized = false

export async function initializeApp(dispatch: AppDispatch): Promise<void> {
  if (isAppInitialized) {
    return
  }

  isAppInitialized = true

  const authUser = getAuthUser()

  if (authUser) {
    dispatch(setSession({ userId: authUser.id, token: authUser.token }))
  }

  await Promise.all([
    dispatch(loadUsers()),
    dispatch(loadSkills()),
    dispatch(loadCities()),
    dispatch(loadCategories()),
  ])
}