import styles from './RegisterProfilePage.module.css'
import { useNavigate } from 'react-router-dom'

import { ProfileForm } from '@/widgets/ProfileForm'
import { useRegistrationProfile } from '@/features/registration'
import { StepIndicator } from '@/shared/ui/StepIndicator'

export default function RegisterProfilePage() {
  const navigate = useNavigate()
  const {
    processRegistrationStep2,
    errors,
    savedValues,
    avatarPreview,
    handleAvatarChange,
  } = useRegistrationProfile()

  const handleBack = () => {
    navigate('/register/credentials')
  }

  return (
    <main className={styles.page}>
      <div className={styles.steps}>
        <StepIndicator currentStep={2} totalSteps={3} />
      </div>
      <ProfileForm
        onSubmit={processRegistrationStep2}
        handleBack={handleBack}
        errors={errors}
        savedValues={savedValues}
        avatarPreview={avatarPreview}
        onAvatarChange={handleAvatarChange}
      />
    </main>
  )
}
