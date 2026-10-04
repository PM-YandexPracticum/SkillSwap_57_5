/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}

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
