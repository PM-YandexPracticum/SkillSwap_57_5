import { BrowserRouter } from 'react-router-dom'

import { StoreProvider } from './providers/StoreProvider'
import { AppRouter } from './providers/RouterProvider'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/reset.css'
import './styles/global.css'

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </StoreProvider>
  )
}
