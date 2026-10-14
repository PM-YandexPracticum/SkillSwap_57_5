import styles from './RegisterProfilePage.module.css'
import { useNavigate } from 'react-router-dom'

import { ProfileForm } from '@/widgets/ProfileForm'
import { StepIndicator } from '@/shared/ui/StepIndicator'

export default function RegisterProfilePage() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/register/credentials')
  }

  const handleSubmit = (data: {
    name: string
    birthDate: Date | undefined
    gender: string
    city: string
    categories: string[]
    subcategories: string[]
  }) => {
    console.log('registration step 2:', data)
    navigate('/register/skill')
  }

  return (
    <main className={styles.page}>
      <div className={styles.steps}>
        <StepIndicator currentStep={2} totalSteps={3} />
      </div>

      <ProfileForm onSubmit={handleSubmit} handleBack={handleBack} />
    </main>
  )
}
