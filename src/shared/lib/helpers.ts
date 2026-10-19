// Форматируем дату на русском языке с днём, месяцем и годом
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

// Обрезаем длинный текст и добавляем многоточие
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

// Создаём уникальный идентификатор
export function generateId(): string {
  return crypto.randomUUID()
}

// Выбираем склонение возраста: год, года или лет
export function getAgeLabel(age: number): string {
  const lastTwoDigits = age % 100
  const lastDigit = age % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'лет'
  }

  if (lastDigit === 1) {
    return 'год'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года'
  }

  return 'лет'
}

// Вычисляем возраст в полных годах по дате рождения
export function getAgeFromBirthDate(birthDate: string | Date): number {
  let birth: Date

  if (birthDate instanceof Date) {
    if (isNaN(birthDate.getTime())) {
      return 0
    }
    birth = birthDate
  } else {
    const dateString = birthDate.split('T')[0] || birthDate.split(' ')[0]
    const parts = dateString.split('-')

    if (parts.length !== 3) {
      return 0
    }

    const [year, month, day] = parts.map((p) => Number(p))

    if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
      return 0
    }

    birth = new Date(year, month - 1, day)

    if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day) {
      return 0
    }
  }

  const now = new Date()

  now.setHours(0, 0, 0, 0)

  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1
  }

  return Math.max(0, age)
}
