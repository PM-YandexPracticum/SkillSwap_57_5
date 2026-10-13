import { Provider } from 'react-redux'
import { store } from '@/store'
import type { ReactNode } from 'react'
import { loadUsers } from '@/store/slices/usersSlice'

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  if (typeof window !== 'undefined') {
    store.dispatch(loadUsers())
  }

  return <Provider store={store}>{children}</Provider>
}
