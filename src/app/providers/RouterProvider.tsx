import { Loader } from '@/shared/ui/Loader'
import { lazy, Suspense } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'

const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterCredentialsPage = lazy(() => import('@/pages//RegisterPage/RegisterCredentialsPage'))
const RegisterProfilePage = lazy(() => import('@/pages/RegisterPage/RegisterProfilePage'))
const RegisterSkillPage = lazy(() => import('@/pages/RegisterPage/RegisterSkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path={'/'} element={<CatalogPage />} />
        <Route path={'/about'} element={<AboutPage />} />
        <Route path={'/skill/:id'} element={<SkillPage />} />
        <Route path={'/login'} element={<LoginPage />} />

        <Route path={'/register'} element={<Navigate to="/register/credentials" replace />} />
        <Route path={'/register/credentials'} element={<RegisterCredentialsPage />} />
        <Route path={'/register/profile'} element={<RegisterProfilePage />} />
        <Route path={'/register/skill'} element={<RegisterSkillPage />} />

        <Route path={'/profile'} element={<ProfilePage />} />
        <Route path={'/favorites'} element={<FavoritesPage />} />
             
        <Route path={'/500'} element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
