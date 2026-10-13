import { useEffect, useRef, useState, type FormEvent } from 'react'
import { DayPicker } from '@daypicker/react'
import { ru } from '@daypicker/react/locale'
import { format } from 'date-fns'
import 'react-day-picker/style.css'

import { FormField } from '@/shared/ui/FormField'
import { InputWithAction } from '@/shared/ui/InputWithAction'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Popover } from '@/shared/ui/Popover'
import { Button } from '@/shared/ui/Button'
import { Combobox } from '@/shared/ui/Combobox/Combobox'

import EditIcon from '@/shared/assets/icons/edit.svg'
import Calendar from '@/shared/assets/icons/calendar.svg'

import styles from './PersonalDataForm.module.css'

type City = {
  id: string
  name: string
}

type EditableField = 'email' | 'name' | 'about'

export function PersonalDataForm() {
  const [email, setEmail] = useState('anna@example.com')
  const [name, setName] = useState('Анна Иванова')
  const [password, setPassword] = useState('')
  const [showPasswordField, setShowPasswordField] = useState(false)

  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(1995, 5, 15))
  const [gender, setGender] = useState('female')
  const [city, setCity] = useState('')
  const [citiesData, setCitiesData] = useState<City[]>([])

  const [about, setAbout] = useState('Люблю узнавать новое, делиться опытом и путешествовать.')

  const [editingField, setEditingField] = useState<EditableField | null>(null)

  const emailRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const aboutRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch('./db/cities.json')
      .then((res) => res.json())
      .then((data: City[]) => {
        setCitiesData(data)

        if (data.length > 0) {
          setCity(data[0].id)
        }
      })
      .catch((err) => console.error('cities fetch error:', err))
  })

  useEffect(() => {
    const field =
      editingField === 'email'
        ? emailRef.current
        : editingField === 'name'
          ? nameRef.current
          : editingField === 'about'
            ? aboutRef.current
            : null

    if (!field) return

    field.focus()

    if (editingField !== 'email') {
      const end = field.value.length
      field.setSelectionRange(end, end)
    }
  }, [editingField])

  const cityOptions = citiesData.map((item) => ({
    value: item.id,
    label: item.name,
  }))

  const closePopover = () => {
    const event = new MouseEvent('pointerdown', { bubbles: true })
    document.dispatchEvent(event)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleFieldBlur = () => {
    setEditingField(null)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormField id="email">
        <InputWithAction
          id="email"
          label="Почта"
          actionIconSrc={EditIcon}
          actionLabel="Редактировать почту"
          onAction={() => setEditingField('email')}
          showAction={editingField !== 'email'}
        >
          <Input
            ref={emailRef}
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            onBlur={handleFieldBlur}
            readOnly={editingField !== 'email'}
          />
        </InputWithAction>
      </FormField>

      <button
        type="button"
        className={styles.passwordToggle}
        onClick={() => setShowPasswordField((prev) => !prev)}
      >
        Изменить пароль
      </button>

      {showPasswordField && (
        <FormField id="password">
          <InputWithAction
            id="password"
            label="Новый пароль"
            actionIconSrc={EditIcon}
            actionLabel="Редактировать пароль"
            onAction={() => {}}
            showAction={false}
          >
            <Input id="password" type="password" value={password} onChange={setPassword}></Input>
          </InputWithAction>
        </FormField>
      )}

      <FormField id="name">
        <InputWithAction
          id="name"
          label="Имя"
          actionIconSrc={EditIcon}
          actionLabel="Редактировать имя"
          onAction={() => setEditingField('name')}
          showAction={editingField !== 'name'}
        >
          <Input
            ref={nameRef}
            id="name"
            value={name}
            onChange={setName}
            onBlur={handleFieldBlur}
            readOnly={editingField !== 'name'}
          />
        </InputWithAction>
      </FormField>

      <div className={styles.rowInputs}>
        <FormField id="birthDate" label="Дата рождения" className={styles.dateFormField}>
          <Popover
            padding="0"
            trigger={
              <button
                id="birthDate"
                type="button"
                className={styles.dateTrigger}
                aria-label={
                  birthDate
                    ? `Дата рождения: ${format(birthDate, 'dd.MM.yyyy')}`
                    : 'Выбрать дату рождения'
                }
              >
                <span className={birthDate ? undefined : styles.datePlaceholder}>
                  {birthDate ? format(birthDate, 'dd.MM.yyyy') : 'дд.мм.гггг'}
                </span>

                <img src={Calendar} alt="" className={styles.dateIcon} />
              </button>
            }
          >
            <div className={styles.popoverContent}>
              <DayPicker
                mode="single"
                className={styles.calendar}
                selected={birthDate}
                onSelect={setBirthDate}
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
                  type="button"
                  variant="secondary"
                  className={styles.calendarButton}
                  onClick={() => {
                    setBirthDate(undefined)
                    closePopover()
                  }}
                >
                  Отменить
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  className={styles.calendarButton}
                  onClick={closePopover}
                >
                  Выбрать
                </Button>
              </div>
            </div>
          </Popover>
        </FormField>

        <Select
          id="gender"
          label="Пол"
          options={[
            { value: '', label: 'Не указан' },
            { value: 'male', label: 'Мужской' },
            { value: 'female', label: 'Женский' },
          ]}
          value={gender}
          onChange={setGender}
          placeholder="Не выбрано"
        />
      </div>

      <FormField id="city" label="Город">
        <Combobox
          id="city"
          value={city}
          options={cityOptions}
          onChange={setCity}
          placeholder="Выберите город"
        />
      </FormField>

      <FormField id="about">
        <InputWithAction
          id="about"
          label="О себе"
          actionIconSrc={EditIcon}
          actionLabel="Редактировать описание"
          onAction={() => {
            setEditingField('about')
          }}
          showAction={editingField !== 'about'}
        >
          <textarea
            ref={aboutRef}
            id="about"
            className={styles.aboutField}
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            onBlur={handleFieldBlur}
            rows={4}
          />
        </InputWithAction>
      </FormField>

      <Button type="submit" variant="primary" className={styles.saveButton}>
        Сохранить
      </Button>
    </form>
  )
}
