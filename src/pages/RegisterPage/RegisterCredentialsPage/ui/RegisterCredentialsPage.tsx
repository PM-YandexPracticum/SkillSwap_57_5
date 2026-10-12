import { CredentialsForm } from '@/widgets/CredentialsForm'
import { useRegistrationCredentials } from '@/features/registration'

import styles from './RegisterCredentialsPage.module.css'

export default function RegisterCredentialsPage() {
  const { processRegistrationStep1, errors, savedValues } = useRegistrationCredentials()

  return (
    <main className={styles.page}>
      <div className={styles.steps} />

      <CredentialsForm
        variant="registration"
        onSubmit={processRegistrationStep1}
        savedValues={savedValues}
        errors={errors}
      />
    </main>
  )
}
