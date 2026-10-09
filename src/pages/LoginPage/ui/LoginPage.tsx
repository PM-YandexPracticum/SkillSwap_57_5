// import styles from "./LoginPage.module.css";
import { useNavigate } from 'react-router-dom'

import { CredentialsForm } from '@/widgets/CredentialsForm'

export default function LoginPage() {
  
  const navigate = useNavigate()

  const handleSubmit = () => {navigate('/profile')}

  return (
    <main>
      <CredentialsForm variant="login" onSubmit={handleSubmit} />
    </main>
  )
}

