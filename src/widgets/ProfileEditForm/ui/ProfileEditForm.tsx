import { useEffect, useRef, useState, type FormEvent } from 'react'
import { parseISO } from 'date-fns'

import { FormField } from '@/shared/ui/FormField'
import { DatePicker } from '@/shared/ui/DatePicker'
import { InputWithAction } from '@/shared/ui/InputWithAction'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { Combobox } from '@/shared/ui/Combobox'

import EditIcon from '@/shared/assets/icons/edit.svg'

import type { User } from '@/entities/user'
import type { UpdateProfileValues, UpdateProfileErrors } from '@/features/profile'
import { useAppSelector } from '@/store/hooks'

import styles from './ProfileEditForm.module.css'

interface ProfileEditFormProps {
  // Данные и обработчик из useUpdateProfile
  currentUser: User | null
  errors?: UpdateProfileErrors
  onSubmit: (data: UpdateProfileValues) => Promise<void>
}

type EditableField = 'email' | 'name' | 'about' | 'birthDate' | 'gender' | 'city'

export function ProfileEditForm({
  // Данные и обработчик из useUpdateProfile
  currentUser,
  errors,
  onSubmit,
}: ProfileEditFormProps) {
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
        <FormField id="birthDate" label="Дата рождения">
          <DatePicker
            id="birthDate"
            value={birthDate}
            onChange={setBirthDate}
            disabled={editingField !== null}
            hasError={Boolean(errors?.birthDate)}
          />
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
