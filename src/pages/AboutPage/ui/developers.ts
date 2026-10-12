export interface Developer {
  id: number
  name: string
  role: string
  about: string
  githubUsername: string
  avatarSrc: string
}

const ABOUT_PLACEHOLDER =
  'Шаблонное описание участника команды. Здесь будет рассказ об образовании, опыте и вкладе в проект.'

// Временные вымышленные данные. Заменить на реальные.
export const developers: Developer[] = [
  { id: 1, name: 'Иванов Иван', role: 'Тимлид', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
  { id: 2, name: 'Петрова Анна', role: 'Помощник тимлида', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
  { id: 3, name: 'Сидоров Алексей', role: 'Разработчик', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
  { id: 4, name: 'Смирнова Ольга', role: 'Разработчик', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
  { id: 5, name: 'Кузнецова Мария', role: 'Разработчик', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
  { id: 6, name: 'Попов Дмитрий', role: 'Разработчик', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
  { id: 7, name: 'Соколов Артём', role: 'Разработчик', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
  { id: 8, name: 'Лебедева Екатерина', role: 'Разработчик', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
  { id: 9, name: 'Козлов Максим', role: 'Разработчик', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
  { id: 10, name: 'Новикова Дарья', role: 'Разработчик', about: ABOUT_PLACEHOLDER, githubUsername: 'USERNAME', avatarSrc: '' },
]