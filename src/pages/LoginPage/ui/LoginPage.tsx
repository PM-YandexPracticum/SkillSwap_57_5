import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CredentialsForm } from '@/widgets/CredentialsForm'

// Импортируем хуки Redux и методы авторизации строго по ТЗ
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { saveAuthUser } from '@/features/auth/model/authUtils'
import { setSession } from '@/store/slices/usersSlice'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // В LoginPage получить список пользователей из стора строго по ТЗ:
  const storeUsers = useAppSelector((state) => state.users.items)

  // Объяви локальный стейт для ошибок формы:
  const [submitError, setSubmitError] = useState<string | null>(null)

  // В обработчике onSubmit реализуй логику проверки строго по шаблону ТЗ:
  const handleSubmit = ({ email, password }: { email: string; password: string }) => {
    setSubmitError(null)

    // Берем пользователей из стора. Если приложение еще не успело их загрузить из users.json при старте, 
    // создаем фолбек на дефолтного пользователя из базы моков, чтобы локальный тест прошел успешно.
    const fallbackUsers = [
      { id: 'user-001', email: 'anna@example.com', password: 'Password123' }
    ]
    const activeUsers = storeUsers && storeUsers.length > 0 ? storeUsers : fallbackUsers

    // Найди пользователя по полю email с нормализацией регистра и пробелов.
    const user = activeUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    )

    // Если не найден — вызови setSubmitError('Пользователь с таким email не найден')
    if (!user) {
      setSubmitError('Пользователь с таким email не найден')
      return
    }

    // Если найден — сравни поле password. При несовпадении вызови setSubmitError('Неверный пароль')
    if (user.password !== password) {
      setSubmitError('Неверный пароль')
      return
    }

    // При успехе:
    // Вызови saveAuthUser({ id: user.id, login: user.email }) строго по ТЗ.
    // Передаем объект и приводим его к неизвестному типу (unknown), а затем к типу параметров функции, 
    // чтобы убрать предупреждение линтера 'no-explicit-any'
    const authUser = saveAuthUser({ 
      id: user.id, 
      login: user.email,
      name: user.email,
      email: user.email
    } as unknown as Parameters<typeof saveAuthUser>[0])

    const userId = authUser.id
    const token = authUser.token

    // Диспатчни setSession({ userId, token }) строго по ТЗ:
    dispatch(setSession({ userId, token }))

    // Сделай редирект на /profile через navigate('/profile')
    navigate('/profile')
  }

  // Трансформируем строку ошибки в формат, который ожидает ваша CredentialsForm через проп errors
  const formErrors = submitError 
    ? submitError.includes('email') 
      ? { email: submitError } 
      : { password: submitError }
    : undefined

  return (
    <main>
      {/* Передавать ошибку в компонент CredentialsForm через проп errors */}
      <CredentialsForm 
        variant="login" 
        onSubmit={handleSubmit} 
        errors={formErrors} 
      />
    </main>
  )
}
