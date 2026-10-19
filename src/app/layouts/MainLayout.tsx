import { Outlet } from 'react-router-dom'

import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'

import styles from './MainLayout.module.css'

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
