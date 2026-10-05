import { AboutPage } from '@/pages/AboutPage'
import CatalogPage from '@/pages/CatalogPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import {
  RegisterCredentialsPage,
  RegisterProfilePage,
  RegisterSkillPage,
} from '@/pages/RegisterPage'
import { ServerErrorPage } from '@/pages/ServerErrorPage'
import { SkillPage } from '@/pages/SkillPage'
import { Suspense } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'

export function AppRouter() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
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
