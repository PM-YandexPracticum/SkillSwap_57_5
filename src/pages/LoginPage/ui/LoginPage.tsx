import { useLogin } from '@/features/auth'
import { AuthCredentialsForm } from '@/widgets/AuthCredentialsForm'

export default function LoginPage() {
  const { handleLogin, errors } = useLogin()

  return (
    <main>
      <AuthCredentialsForm variant="login" onSubmit={handleLogin} errors={errors} />
    </main>
  )
}
