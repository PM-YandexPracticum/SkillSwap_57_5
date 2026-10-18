import clsx from 'clsx'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { DayPicker } from '@daypicker/react'
import { ru } from '@daypicker/react/locale'
import { format, parseISO } from 'date-fns'
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

import type { User } from '@/entities/user'
import type { UpdateProfileValues, UpdateProfileErrors } from '@/features/profile'
import { useAppSelector } from '@/store/hooks'

import styles from './PersonalDataForm.module.css'

interface PersonalDataFormProps {
  // Данные и обработчик из useUpdateProfile
  currentUser: User | null
  errors?: UpdateProfileErrors
  onSubmit: (data: UpdateProfileValues) => Promise<void>
}

type EditableField = 'email' | 'name' | 'about' | 'birthDate' | 'gender' | 'city'

export function PersonalDataForm({
  // Данные и обработчик из useUpdateProfile
  currentUser,
  errors,
  onSubmit,
}: PersonalDataFormProps) {
  const cities = useAppSelector((state) => state.cities.items)

  const [email, setEmail] = useState(currentUser?.email ?? '')
  const [name, setName] = useState(currentUser?.name ?? '')
  const [password, setPassword] = useState('')
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | undefined>(() =>
    currentUser?.birthDate ? parseISO(currentUser.birthDate) : undefined,
  )
  const [gender, setGender] = useState<string>(currentUser?.gender ?? '')
  const [city, setCity] = useState(currentUser?.cityId ?? '')
  const [about, setAbout] = useState(currentUser?.about ?? '')

  const [editingField, setEditingField] = useState<EditableField | null>(null)

  const emailRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const aboutRef = useRef<HTMLTextAreaElement>(null)

  // После нажатия карандаша ставим фокус в выбранное поле
  useEffect(() => {
    let field: HTMLInputElement | HTMLTextAreaElement | null = null

    if (editingField === 'email') {
      field = emailRef.current
    }

    if (editingField === 'name') {
      field = nameRef.current
    }

    if (editingField === 'about') {
      field = aboutRef.current
    }

    if (!field) return

    field.focus()

    if (editingField !== 'email') {
      const end = field.value.length
      field.setSelectionRange(end, end)
    }
  }, [editingField])

  const cityOptions = cities.map((item) => ({
    value: item.id,
    label: item.name,
  }))

  const closePopover = () => {
    const event = new MouseEvent('pointerdown', { bubbles: true })
    document.dispatchEvent(event)
  }

  // Собираем значения полей и передаём их в хук
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await onSubmit({
      email,
      password,
      name,
      birthDate,
      gender,
      city,
      about,
    })
  }

  const handleFieldBlur = () => {
    setEditingField(null)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
            className={errors?.email ? styles.inputError : undefined}
          />
        </InputWithAction>
        {errors?.email && (
          <p className={styles.errorHint} role="alert">
            {errors.email}
          </p>
        )}
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
            <Input
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              className={errors?.password ? styles.inputError : undefined}
            />
          </InputWithAction>
          {errors?.password && (
            <p className={styles.errorHint} role="alert">
              {errors.password}
            </p>
          )}
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
            className={errors?.name ? styles.inputError : undefined}
          />
        </InputWithAction>
        {errors?.name && (
          <p className={styles.errorHint} role="alert">
            {errors.name}
          </p>
        )}
      </FormField>

      <div className={styles.rowInputs}>
        <FormField id="birthDate" label="Дата рождения" className={styles.dateFormField}>
          <Popover
            padding="0"
            trigger={
              <button
                id="birthDate"
                type="button"
                className={clsx(styles.dateTrigger, errors?.birthDate && styles.inputError)}
                disabled={editingField !== null}
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
                defaultMonth={birthDate}
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
                  variant="secondary"
                  className={styles.calendarButton}
                  onClick={() => {
                    setBirthDate(undefined)
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
          {errors?.birthDate && (
            <p className={styles.errorHint} role="alert">
              {errors.birthDate}
            </p>
          )}
        </FormField>

        <div>
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
            disabled={editingField !== null}
            placeholder="Не выбрано"
          />
          {errors?.gender && (
            <p className={styles.errorHint} role="alert">
              {errors.gender}
            </p>
          )}
        </div>
      </div>

      <FormField id="city" label="Город">
        <Combobox
          id="city"
          value={city}
          options={cityOptions}
          onChange={setCity}
          disabled={editingField !== null}
          placeholder="Выберите город"
          alwaysShowArrow={true}
          showClearButton={true}
          showAllOnOpen={true}
        />
        {errors?.city && (
          <p className={styles.errorHint} role="alert">
            {errors.city}
          </p>
        )}
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
            readOnly={editingField !== 'about'}
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
