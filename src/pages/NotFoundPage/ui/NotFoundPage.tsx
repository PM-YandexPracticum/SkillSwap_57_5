import { NotFoundPage as NotFoundWidget } from '@/widgets/NotFoundPage'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <NotFoundWidget />
    </main>
  )
}
