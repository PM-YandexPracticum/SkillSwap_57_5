import styles from './RegisterProfilePage.module.css'
import { useNavigate } from 'react-router-dom'

import { ProfileForm } from '@/widgets/ProfileForm'
import { useRegistrationProfile } from '@/features/registration'

export default function RegisterProfilePage() {

  const navigate = useNavigate()
  const { processRegistrationStep2, errors, savedValues } = useRegistrationProfile()

  const handleBack = () => {
    navigate('/register/credentials')
  }

  return (
    <main className={styles.page}>
      <ProfileForm
        onSubmit={processRegistrationStep2}
        handleBack={handleBack}
        errors={errors}
        savedValues={savedValues}
      />
    </main>
  )
}
