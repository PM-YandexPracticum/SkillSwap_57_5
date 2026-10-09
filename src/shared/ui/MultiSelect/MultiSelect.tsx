import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import chevronIcon from '@/shared/assets/icons/chevron-down.svg'
import type { MultiSelectProps } from './types'
import styles from './MultiSelect.module.css'

export function MultiSelect({
  id,
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Выберите варианты',
  className,
}: MultiSelectProps) {
  // 1. Получаем данные
  // options все доступные варианты списка
  // selectedValues массив выбранных значений
  // onChange функция, которая обновит выбранные значения в форме

  const [isListOpen, setIsListOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isListOpen) return

    function handleOutsideClick(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsListOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsListOpen(false)

        containerRef.current?.querySelector('button')?.focus()
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isListOpen])

  // 2. Обрабатываем выбор или снятие одного варианта
  function toggleOption(optionValue: string) {
    if (selectedValues.includes(optionValue)) {
      // Если значение уже выбрано — убираем его из массива
      // Передаём новый массив родительской форме
      onChange(selectedValues.filter((item) => item !== optionValue))
    } else {
      // Если значение не выбрано добавляем его
      // Старый массив не изменяем, создаём новый
      onChange([...selectedValues, optionValue])
    }
  }

  // 3. Собираем текст для кнопки из названий выбранных вариантов
  const selectedNames = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label)
    .join(', ')

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <span id={`${id}-label`} className={styles.label}>
        {label}
      </span>

      <div className={clsx(styles.field, isListOpen && styles.fieldOpen)}>
        <Button
          id={id}
          type="button"
          variant="secondary"
          className={styles.trigger}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-expanded={isListOpen}
          aria-controls={isListOpen ? `${id}-list` : undefined}
          // Меняем открытое состояние на противоположное.
          onClick={() => setIsListOpen(!isListOpen)}
        >
          <span
            id={`${id}-value`}
            className={clsx(styles.value, !selectedNames && styles.placeholder)}
          >
            {/* Показываем названия выбранных вариантов или текст подсказки. */}
            {selectedNames || placeholder}
          </span>

          <img
            src={chevronIcon}
            alt=""
            className={clsx(styles.arrow, isListOpen && styles.arrowOpen)}
          />
        </Button>

        {isListOpen && (
          <ul id={`${id}-list`} className={styles.list}>
            {options.map((option) => (
              <li key={option.value} className={styles.option}>
                <Checkbox
                  // Уникальный id связывает чекбокс с его подписью.
                  id={`${id}-${option.value}`}
                  label={option.label}
                  className={styles.checkbox}
                  // Галочка стоит, если значение есть в массиве выбранных.
                  checked={selectedValues.includes(option.value)}
                  // При переключении добавляем или удаляем значение.
                  onChange={() => toggleOption(option.value)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
