import { useNavigate } from 'react-router-dom'
import { useRegistrationSkill } from '@/features/registration'
import { StepIndicator } from '@/shared/ui/StepIndicator'
import { SkillRegistrationForm } from '@/widgets/SkillRegistrationForm'
import styles from './RegisterSkillPage.module.css'

export default function RegisterSkillPage() {
  const navigate = useNavigate()
  const { submitRegistrationSkill, errors, savedValues, files, handleSkillImagesChange } =
    useRegistrationSkill()

  const handleBack = () => {
    navigate('/register/profile')
  }

  return (
    <main className={styles.page}>
      <StepIndicator currentStep={3} totalSteps={3} />
      <SkillRegistrationForm
        onSubmit={submitRegistrationSkill}
        errors={errors}
        savedValues={savedValues}
        skillImages={files}
        onSkillImagesChange={handleSkillImagesChange}
        onBackButton={handleBack}
      />
    </main>
  )
}
