import { Provider } from 'react-redux'
import { store } from '@/store'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { loadUsers, setSession } from '@/store/slices/usersSlice'
import { restoreAuthSession } from '@/features/auth/model/authUtils'

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  useEffect(() => {
    const state = store.getState()

    if (state.users.currentUserId) {
      store.dispatch(loadUsers())
      return
    }

    const authUser = restoreAuthSession()

    if (authUser) {
      store.dispatch(setSession({ userId: authUser.id, token: authUser.token }))
    }

    store.dispatch(loadUsers())
  }, [])

  return <Provider store={store}>{children}</Provider>
}
