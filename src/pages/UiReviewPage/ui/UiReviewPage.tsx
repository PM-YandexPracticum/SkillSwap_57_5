import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { NotFoundPage } from '@/widgets/NotFoundPage'

import styles from './UiReviewPage.module.css'

export default function UiReviewPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <NotFoundPage />
      </main>
      <Footer />
    </div>
  )
}
