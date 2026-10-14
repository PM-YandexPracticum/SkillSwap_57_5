import { SkillForm } from '@/widgets/SkillForm'
import { StepIndicator } from '@/shared/ui/StepIndicator'

import styles from './RegisterSkillPage.module.css'

export default function RegisterSkillPage() {
  return (
    <main className={styles.page}>
      <div className={styles.steps}>
        <StepIndicator currentStep={3} totalSteps={3} />
      </div>

      <SkillForm />
    </main>
  )
}
