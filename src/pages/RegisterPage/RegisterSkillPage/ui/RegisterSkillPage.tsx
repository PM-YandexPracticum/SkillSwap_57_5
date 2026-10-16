import { useNavigate } from 'react-router-dom'
import { useRegistrationSkill } from '@/features/registration'
// ИСПРАВЛЕНО: Импортируем точный тип для аргументов формы
import type { RegistrationSkillValues } from '@/features/registration'
import { StepIndicator } from '@/shared/ui/StepIndicator/StepIndicator'
import { SkillForm } from '@/widgets/SkillForm'
import styles from './RegisterSkillPage.module.css'

export default function RegisterSkillPage() {
  const navigate = useNavigate()
  const { processRegistrationStep3, errors, savedValues } = useRegistrationSkill()

  // ИСПРАВЛЕНО: Заменили any на строгий тип RegistrationSkillValues по требованию линтера
  const handleSubmit = async (formData: RegistrationSkillValues) => {
    const isSuccess = await processRegistrationStep3(formData)
    
    if (isSuccess) {
      navigate('/') 
      return true
    }
    return false
  }

  return (
    <main className={styles.page}>
      <StepIndicator currentStep={3} totalSteps={3} />
      <SkillForm
        onSubmit={handleSubmit}
        handleBack={() => navigate('/register/profile')}
        errors={errors}
        savedValues={savedValues}
      />
    </main>
  )
}
