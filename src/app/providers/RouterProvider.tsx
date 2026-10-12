import { lazy, Suspense } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { Loader } from '@/shared/ui/Loader'
import { MainLayout } from '../layouts/MainLayout'
import { AuthLayout } from '../layouts/AuthLayout' // Наш новый лайаут авторизации

const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterCredentialsPage = lazy(() => import('@/pages/RegisterPage/RegisterCredentialsPage'))
const RegisterProfilePage = lazy(() => import('@/pages/RegisterPage/RegisterProfilePage'))
const RegisterSkillPage = lazy(() => import('@/pages/RegisterPage/RegisterSkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const RegisterPreviewPage = lazy(() => import('@/pages/RegisterPreviewPage'))
const SkillExchangePage = lazy(() => import('@/pages/SkillExchangePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
// Страница для локального ревью компонентов доступна только при npm run dev
const UiReviewPage = import.meta.env.DEV ? lazy(() => import('@/pages/UiReviewPage')) : null

export function AppRouter() {
  const location = useLocation()
  const backgroundLocation = location.state?.backgroundLocation

  return (
    <Suspense fallback={<Loader />}>
      <Routes location={backgroundLocation || location}>
        {UiReviewPage && <Route path="/dev" element={<UiReviewPage />} />}

        {/* Главная обёртка MainLayout для обычных страниц (убрали отсюда /login) */}
        <Route element={<MainLayout />}>
          <Route path={'/'} element={<CatalogPage />} />
          <Route path={'/about'} element={<AboutPage />} />
          <Route path={'/skill/:id'} element={<SkillPage />} />
          <Route path={'/profile'} element={<ProfilePage />} />
          <Route path={'/favorites'} element={<FavoritesPage />} />
          <Route path={'/500'} element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* НОВАЯ обёртка AuthLayout для страниц входа и регистрации строго по ТЗ! */}
        <Route element={<AuthLayout />}>
          <Route path={'/login'} element={<LoginPage />} />
          <Route path={'/register'} element={<Navigate to="/register/credentials" replace />} />
          <Route path={'/register/credentials'} element={<RegisterCredentialsPage />} />
          <Route path={'/register/profile'} element={<RegisterProfilePage />} />
          <Route path={'/register/skill'} element={<RegisterSkillPage />} />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/register/skill/:id" element={<RegisterPreviewPage />} />
          <Route path="/skill/:id/exchange" element={<SkillExchangePage />} />
        </Routes>
      )}
    </Suspense>
  )
}
