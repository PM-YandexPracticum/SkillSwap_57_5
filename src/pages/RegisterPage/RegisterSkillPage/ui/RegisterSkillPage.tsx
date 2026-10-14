import { useNavigate } from 'react-router-dom'
import { useRegistrationSkill } from '@/features/registration'
import { StepIndicator } from '@/shared/ui/StepIndicator/StepIndicator'
import { SkillForm } from '@/widgets/SkillForm'
import styles from './RegisterSkillPage.module.css'

export default function RegisterSkillPage() {
  const navigate = useNavigate()
  const { processRegistrationStep3, errors, savedValues } = useRegistrationSkill()

  return (
    <main className={styles.page}>
      <StepIndicator currentStep={3} totalSteps={3} />
      <SkillForm
        onSubmit={processRegistrationStep3}
        handleBack={() => navigate('/register/profile')}
        errors={errors}
        savedValues={savedValues}
      />
    </main>
  )
}
