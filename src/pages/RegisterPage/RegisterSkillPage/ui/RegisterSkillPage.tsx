import { useLocation, useNavigate } from 'react-router-dom'
import { useRegistrationSkill } from '@/features/registration'
import { StepIndicator } from '@/shared/ui/StepIndicator/StepIndicator'
import { SkillForm } from '@/widgets/SkillForm'
import styles from './RegisterSkillPage.module.css'

export default function RegisterSkillPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { processRegistrationStep3, errors, savedValues } = useRegistrationSkill()

  const handleStep3Success = () => {
    navigate('/register/preview', {
      state: { backgroundLocation: location },
    })
  }

  return (
    <main className={styles.page}>
      <StepIndicator currentStep={3} totalSteps={3} />
      <SkillForm
        onSubmit={processRegistrationStep3}
        handleBack={() => navigate('/register/profile')}
        errors={errors}
        savedValues={savedValues}
        onSubmitSuccess={handleStep3Success}
      />
    </main>
  )
}
