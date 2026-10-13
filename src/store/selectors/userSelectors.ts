import { RootState } from '../index'

export const selectIsAuthenticated = (state: RootState) => {
  return state.users.currentUserId !== null
}

export const selectCurrentUserName = (state: RootState) => {
  const userId = state.users.currentUserId
  if (!userId) return null

  const user = state.users.items.find((u) => u.id === userId)
  return user ? user.name : null
}
