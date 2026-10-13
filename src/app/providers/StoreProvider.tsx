import { Provider } from 'react-redux'
import { store } from '@/store'
import type { ReactNode } from 'react'
import { loadUsers, setSession } from '@/store/slices/usersSlice'
import { restoreAuthSession } from '@/features/auth/model/authUtils'

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  if (typeof window !== 'undefined') {
    store.dispatch(loadUsers())

    const authUser = restoreAuthSession()

    if (authUser) {
      store.dispatch(setSession({ userId: authUser.id, token: authUser.token }))
    }
  }

  return <Provider store={store}>{children}</Provider>
}