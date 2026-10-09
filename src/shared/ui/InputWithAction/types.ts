import type { ReactNode } from 'react'

export interface InputWithActionProps {
  // Для поля и лейбла к нему
  children: ReactNode
  id: string
  label: string

  // Кнопка действия iconButton
  actionIconSrc: string
  actionLabel: string
  onAction: () => void // передаем в обработчик iconButton
  showAction: boolean // показываем iconButton если true
  disabled?: boolean

  // Стили для обертки поля и кнопки
  className?: string
  iconButtonClassName?: string
}
