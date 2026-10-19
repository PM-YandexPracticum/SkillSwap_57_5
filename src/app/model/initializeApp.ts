import type { AppDispatch } from '@/store'
import { restoreAuthSession } from '@/features/auth'
import { restoreNotifications } from '@/features/notifications'
import { loadUsers, setSession } from '@/store/slices/usersSlice'
import { loadSkills } from '@/store/slices/skillsSlice'
import { loadCities } from '@/store/slices/citiesSlice'
import { loadCategories } from '@/store/slices/categoriesSlice'
import { setNotifications } from '@/store/slices/notificationsSlice'

let isAppInitialized = false

export async function initializeApp(dispatch: AppDispatch): Promise<void> {
  if (isAppInitialized) {
    return
  }

  isAppInitialized = true

  const notifications = restoreNotifications()

  if (notifications) {
    dispatch(setNotifications(notifications))
  }

  const authUser = restoreAuthSession()

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
