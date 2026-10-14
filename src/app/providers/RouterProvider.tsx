import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { Loader } from '@/shared/ui/Loader'
import { MainLayout } from '../layouts/MainLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { PrivateRoute } from '@/features/auth'
import { useAppDispatch } from '@/store/hooks'
import { useAppData } from '@/store/useAppData'
import { initializeApp } from '../model/initializeApp'

import styles from './RouterProvider.module.css'

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
const UiReviewPage = import.meta.env.DEV ? lazy(() => import('@/pages/UiReviewPage')) : null

export function AppRouter() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const backgroundLocation = location.state?.backgroundLocation
  const { isLoading, errorMessage } = useAppData()

  useEffect(() => {
    initializeApp(dispatch)
  }, [dispatch])

  if (isLoading) {
    return (
      <div className={styles.centered}>
        <Loader text="Загружаем данные" />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className={styles.centered}>
        <p className={styles.error}>{errorMessage}</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes location={backgroundLocation || location}>
        {UiReviewPage && <Route path="/dev" element={<UiReviewPage />} />}

        <Route element={<MainLayout />}>
          <Route path={'/'} element={<CatalogPage />} />
          <Route path={'/about'} element={<AboutPage />} />
          <Route path={'/skill/:id'} element={<SkillPage />} />
          <Route
            path={'/profile'}
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path={'/favorites'} element={<FavoritesPage />} />
          <Route path={'/500'} element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

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
          <Route path="/register/preview" element={<RegisterPreviewPage />} />
          <Route path="/skill/:id/exchange" element={<SkillExchangePage />} />
        </Routes>
      )}
    </Suspense>
  )
}
