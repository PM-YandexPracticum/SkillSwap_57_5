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
const RegisterCredentialsPage = lazy(() => import('@/pages/RegisterPages/RegisterCredentialsPage'))
const RegisterProfilePage = lazy(() => import('@/pages/RegisterPages/RegisterProfilePage'))
const RegisterSkillPage = lazy(() => import('@/pages/RegisterPages/RegisterSkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const RegisterPreviewPage = lazy(() => import('@/pages/RegisterPages/RegisterPreviewPage'))
const RegisterSuccessPage = lazy(() => import('@/pages/RegisterPages/RegisterSuccessPage'))
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
    <Suspense
      fallback={
        <div className={styles.centered}>
          <Loader />
        </div>
      }
    >
      <Routes location={backgroundLocation || location}>
        {UiReviewPage && <Route path="/dev" element={<UiReviewPage />} />}

        <Route element={<MainLayout />}>
          <Route path={'/'} element={<CatalogPage />} />
          <Route path={'/about'} element={<AboutPage />} />
          <Route path={'/skill/:id'} element={<SkillPage />} />
          <Route path={'/register/preview'} element={<Navigate to="/register/skill" replace />} />
          <Route path={'/register/success'} element={<Navigate to="/" replace />} />
          <Route
            path={'/skill/:id/exchange'}
            element={<Navigate to=".." relative="path" replace />}
          />
          <Route path={'/500'} element={<ServerErrorPage />} />
          <Route path={'*'} element={<NotFoundPage />} />
          <Route
            path={'/profile'}
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/favorites'}
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route
            path={'/login'}
            element={
              <PrivateRoute guestOnly>
                <LoginPage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/register'}
            element={
              <PrivateRoute guestOnly>
                <Navigate to="/register/credentials" replace />
              </PrivateRoute>
            }
          />
          <Route
            path={'/register/credentials'}
            element={
              <PrivateRoute guestOnly>
                <RegisterCredentialsPage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/register/profile'}
            element={
              <PrivateRoute guestOnly>
                <RegisterProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/register/skill'}
            element={
              <PrivateRoute guestOnly>
                <RegisterSkillPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path={'/register/preview'}
            element={
              <PrivateRoute guestOnly>
                <RegisterPreviewPage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/register/success'}
            element={
              <PrivateRoute>
                <RegisterSuccessPage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/skill/:id/exchange'}
            element={
              <PrivateRoute>
                <SkillExchangePage />
              </PrivateRoute>
            }
          />
        </Routes>
      )}
    </Suspense>
  )
}
