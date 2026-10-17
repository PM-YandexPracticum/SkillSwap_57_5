import type { RootState } from '../index'

export const selectIsAuthenticated = (state: RootState) => {
  return state.users.currentUserId !== null
}

export const selectCurrentUser = (state: RootState) => {
  return state.users.items.find((user) => user.id === state.users.currentUserId) ?? null
}

export const selectCurrentUserName = (state: RootState) => {
  const userId = state.users.currentUserId
  if (!userId) return null

  const user = state.users.items.find((item) => item.id === userId)
  return user?.name ?? null
}
