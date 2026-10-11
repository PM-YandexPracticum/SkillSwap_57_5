import { CredentialsForm } from '@/widgets/CredentialsForm'
import { useRegistrationCredentials } from '@/features/registration'

export default function RegisterCredentialsPage() {
  const { processRegistrationStep1, errors, savedValues } = useRegistrationCredentials()

  return (
    <main>
      <CredentialsForm 
        variant="registration" 
        onSubmit={processRegistrationStep1} 
        savedValues={savedValues}
        errors={errors}
      />
    </main>
  )
}
