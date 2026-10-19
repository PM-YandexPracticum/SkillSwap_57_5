import { ServerError } from '@/widgets/ServerError'
import styles from './ServerErrorPage.module.css'

export default function ServerErrorPage() {
  return (
    <main className={styles.page}>
      <ServerError />
    </main>
  )
}
