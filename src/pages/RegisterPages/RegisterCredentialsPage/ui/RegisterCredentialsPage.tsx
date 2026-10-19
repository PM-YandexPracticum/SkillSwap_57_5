import { AuthCredentialsForm } from '@/widgets/AuthCredentialsForm'
import { useRegistrationCredentials } from '@/features/registration'
import { StepIndicator } from '@/shared/ui/StepIndicator'

import styles from './RegisterCredentialsPage.module.css'

export default function RegisterCredentialsPage() {
  const { submitRegistrationCredentials, errors, savedValues } = useRegistrationCredentials()

  return (
    <main className={styles.page}>
      <div className={styles.steps}>
        <StepIndicator currentStep={1} totalSteps={3} />
      </div>

      <AuthCredentialsForm
        variant="registration"
        onSubmit={submitRegistrationCredentials}
        savedValues={savedValues}
        errors={errors}
      />
    </main>
  )
}
