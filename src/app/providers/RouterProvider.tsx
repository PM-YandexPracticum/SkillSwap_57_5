import { Loader } from '@/shared/ui/Loader'
import { lazy, Suspense } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'

const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterCredentialsPage = lazy(() => import('@/pages/RegisterPage/RegisterCredentialsPage'))
const RegisterProfilePage = lazy(() => import('@/pages/RegisterPage/RegisterProfilePage'))
const RegisterSkillPage = lazy(() => import('@/pages/RegisterPage/RegisterSkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
// Страница для локального ревью компонентов доступна только при npm run dev
const UiReviewPage = import.meta.env.DEV ? lazy(() => import('@/pages/UiReviewPage')) : null

export function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {UiReviewPage && <Route path="/dev" element={<UiReviewPage />} />}

        {/* Главная обёртка MainLayout для всех страниц, кроме регистрации */}
        <Route element={<MainLayout />}>
          <Route path={'/'} element={<CatalogPage />} />
          <Route path={'/about'} element={<AboutPage />} />
          <Route path={'/skill/:id'} element={<SkillPage />} />
          <Route path={'/login'} element={<LoginPage />} />
          <Route path={'/profile'} element={<ProfilePage />} />
          <Route path={'/favorites'} element={<FavoritesPage />} />
          <Route path={'/500'} element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Маршруты регистрации — снаружи MainLayout (без Header и Footer) */}
        <Route path={'/register'} element={<Navigate to="/register/credentials" replace />} />
        <Route path={'/register/credentials'} element={<RegisterCredentialsPage />} />
        <Route path={'/register/profile'} element={<RegisterProfilePage />} />
        <Route path={'/register/skill'} element={<RegisterSkillPage />} />
      </Routes>
    </Suspense>
  )
}
