import { BrowserRouter } from 'react-router-dom'

import { StoreProvider } from './providers/StoreProvider'
import { AppRouter } from './providers/RouterProvider'
import './styles/global.css'

import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Header />
        <AppRouter />
        <Footer />
      </BrowserRouter>
    </StoreProvider>
  )
}
