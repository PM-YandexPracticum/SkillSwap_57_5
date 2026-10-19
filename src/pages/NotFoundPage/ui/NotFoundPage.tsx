import { NotFoundError } from '@/widgets/NotFoundError'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <NotFoundError />
    </main>
  )
}
