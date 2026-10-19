import clsx from 'clsx'
import { DayPicker } from '@daypicker/react'
import { ru } from '@daypicker/react/locale'
import { format } from 'date-fns'
import 'react-day-picker/style.css'

import { Button } from '@/shared/ui/Button'
import { Popover } from '@/shared/ui/Popover'
import calendarIcon from '@/shared/assets/icons/calendar.svg'

import type { DatePickerProps } from './types'
import styles from './DatePicker.module.css'

export function DatePicker({
  id,
  value,
  onChange,
  disabled = false,
  hasError = false,
}: DatePickerProps) {
  const closePopover = () => {
    const event = new MouseEvent('pointerdown', { bubbles: true })
    document.dispatchEvent(event)
  }

  return (
    <div className={styles.root}>
      <Popover
        padding="0"
        trigger={
          <button
            id={id}
            type="button"
            className={clsx(styles.dateTrigger, hasError && styles.inputError)}
            disabled={disabled}
            aria-label={
              value ? `Дата рождения: ${format(value, 'dd.MM.yyyy')}` : 'Выбрать дату рождения'
            }
          >
            <span className={value ? undefined : styles.datePlaceholder}>
              {value ? format(value, 'dd.MM.yyyy') : 'дд.мм.гггг'}
            </span>
            <img src={calendarIcon} alt="" className={styles.dateIcon} />
          </button>
        }
      >
        <div className={styles.popoverContent}>
          <DayPicker
            mode="single"
            className={styles.calendar}
            selected={value}
            defaultMonth={value}
            onSelect={onChange}
            captionLayout="dropdown"
            locale={ru}
            showOutsideDays
            fixedWeeks
            hideNavigation
            classNames={{
              months: styles.calendarMonths,
              month_caption: styles.monthCaption,
              dropdowns: styles.dropdowns,
              dropdown_root: styles.dropdownRoot,
              caption_label: styles.captionLabel,
              chevron: styles.calendarChevron,
              month_grid: styles.monthGrid,
              weekday: styles.weekday,
              day_button: styles.dayButton,
              outside: styles.outsideDay,
              selected: styles.selectedDay,
            }}
          />
          <div className={styles.calendarFooter}>
            <Button
              variant="secondary"
              className={styles.calendarButton}
              onClick={() => {
                onChange(undefined)
                closePopover()
              }}
            >
              Отменить
            </Button>
            <Button variant="primary" className={styles.calendarButton} onClick={closePopover}>
              Выбрать
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  )
}
