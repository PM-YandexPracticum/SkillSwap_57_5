import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import { format } from 'date-fns'
import 'react-day-picker/style.css'

import { Select } from '@/shared/ui/Select'
import { InfoBlock } from '@/shared/ui/InfoBlock'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Combobox } from '@/shared/ui/Combobox'
import { FormField } from '@/shared/ui/FormField'
import { AvatarUploadButton } from '@/shared/ui/AvatarUploadButton'
import { Popover } from '@/shared/ui/Popover'
import { MultiSelect } from '@/shared/ui/MultiSelect'
import { IconButton } from '@/shared/ui/IconButton'

import userInfo from '@/shared/assets/icons/user-info.svg'
import calendarIcon from '@/shared/assets/icons/calendar.svg'

import styles from './ProfileForm.module.css'

interface ProfileFormProps {
  onSubmit: (data: {
    name: string
    birthDate: Date | undefined
    gender: string
    city: string
    categories: string[]
    subcategories: string[]
  }) => void
  handleBack: () => void
}

type Category = {
  id: string
  name: string
  subcategories: { id: string; name: string }[]
}

type City = { id: string; name: string }

export function ProfileForm({ onSubmit, handleBack }: ProfileFormProps) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [gender, setGender] = useState('')
  const [city, setCity] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])
  const [subcategories, setSubcategories] = useState<string[]>([])

  const [categoriesData, setCategoriesData] = useState<Category[]>([])
  const [citiesData, setCitiesData] = useState<City[]>([])

  const closePopover = () => {
    const event = new MouseEvent('pointerdown', { bubbles: true })
    document.dispatchEvent(event)
  }

  useEffect(() => {
    fetch('/db/categories.json')
      .then((res) => res.json())
      .then(setCategoriesData)
      .catch((err) => console.error('categories fetch error:', err))
  }, [])

  useEffect(() => {
    fetch('/db/cities.json')
      .then((res) => res.json())
      .then((data: City[]) => setCitiesData(data))
      .catch((err) => console.error('cities fetch error:', err))
  }, [])

  const categoryOptions = categoriesData.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))

  const subcategoryOptions = categoriesData.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      value: sub.id,
      label: sub.name,
    })),
  )

  const cityOptions = citiesData.map((city) => ({
    value: city.id,
    label: city.name,
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, birthDate, gender, city, categories, subcategories })
  }

  return (
    <section className={styles.container}>
      <div className={styles.contentContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <AvatarUploadButton />

          <FormField id="name" label="Имя">
            <Input id="name" value={name} onChange={setName} placeholder="Введите ваше имя" />
          </FormField>

          <div className={styles.rowInputs}>
            <FormField id="birthDate" label="Дата рождения">
              <Popover
                trigger={
                  <button
                    type="button"
                    className={styles.dateTrigger}
                    aria-label="Выбрать дату рождения"
                  >
                    <div className={styles.dateField}>
                      <Input
                        id="birthDate-input"
                        className={styles.dateInput}
                        readOnly
                        value={birthDate ? format(birthDate, 'dd.MM.yyyy') : ''}
                        placeholder="дд.мм.гггг"
                        onChange={() => {}}
                      />
                      <IconButton
                        src={calendarIcon}
                        ariaLabel="Календарь"
                        className={styles.calendarIconButton}
                        onClick={() => {}}
                      />
                    </div>
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
                    classNames={{
                      weekday: styles.weekday,
                      selected: styles.selectedDay,
                    }}
                  />
                  <div className={styles.calendarFooter}>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setBirthDate(undefined)
                        closePopover()
                      }}
                    >
                      Отменить
                    </Button>
                    <Button variant="primary" onClick={closePopover}>
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
              ariaLabel="Выберите город"
              value={city}
              onChange={setCity}
              options={cityOptions}
              placeholder="Выберите город"
              disabled={citiesData.length === 0}
            />
          </FormField>

          <MultiSelect
            id="categories"
            label="Категории"
            options={categoryOptions}
            selectedValues={categories}
            onChange={setCategories}
            placeholder="Выберите категории"
          />

          <MultiSelect
            id="subcategories"
            label="Подкатегории"
            options={subcategoryOptions}
            selectedValues={subcategories}
            onChange={setSubcategories}
            placeholder="Выберите подкатегории"
          />

          <div className={styles.buttonContainer}>
            <Button type="button" variant="secondary" onClick={handleBack}>
              Назад
            </Button>
            <Button type="submit">Продолжить</Button>
          </div>
        </form>
      </div>
      <div className={styles.contentContainer}>
        <InfoBlock
          src={userInfo}
          title="Расскажите немного о себе"
          description="Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена"
        />
      </div>
    </section>
  )
}
