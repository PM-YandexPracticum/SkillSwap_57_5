import { developers } from './developers'
import { DeveloperCard } from './DeveloperCard'
import styles from './AboutePage.module.css'

export default function AboutPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Команда разработчиков SkillSwap</h1>
      <ul className={styles.list}>
        {developers.map((developer) => (
          <li key={developer.id} className={styles.item}>
            <DeveloperCard developer={developer} />
          </li>
        ))}
      </ul>
    </section>
  )
}
