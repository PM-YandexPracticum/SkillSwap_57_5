import { useLogin } from '@/features/auth'
import { CredentialsForm } from '@/widgets/CredentialsForm'

export default function LoginPage() {
  const { handleLogin, errors } = useLogin()

  return (
    <main>
      <CredentialsForm variant="login" onSubmit={handleLogin} errors={errors} />
    </main>
  )
}
