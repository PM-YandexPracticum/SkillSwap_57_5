// import styles from './RegisterCredentialsPage.module.css'
import { useNavigate } from 'react-router-dom'

import { CredentialsForm } from '@/widgets/CredentialsForm'

export default function RegisterCredentialsPage() {
  
  const navigate = useNavigate()

  const handleSubmit = (data: { email: string; password: string }) => {
    console.log('registration step 1:', data)
    navigate('/register/profile')
  }

  return (
    <main>
      <CredentialsForm variant="registration" onSubmit={handleSubmit} />
    </main>
  )
}
