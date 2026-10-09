import { ServerErrorPage as ServerErrorWidget } from '@/widgets/ServerErrorPage'
import styles from './ServerErrorPage.module.css'

export default function ServerErrorPage() {
  return (
    <main className={styles.page}>
      <ServerErrorWidget />
    </main>
  )
}
