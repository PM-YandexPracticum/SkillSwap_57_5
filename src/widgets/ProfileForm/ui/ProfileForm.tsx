import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import { format } from 'date-fns'
import 'react-day-picker/style.css'

import type { SkillCategoryId, SkillSubcategoryId } from '@/entities/category'
import type { Gender } from '@/entities/user'

import { Select } from '@/shared/ui/Select'
import { InfoBlock } from '@/shared/ui/InfoBlock'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Combobox } from '@/shared/ui/Combobox'
import { FormField } from '@/shared/ui/FormField'
import { AvatarUploadButton } from '@/shared/ui/AvatarUploadButton'
import { Popover } from '@/shared/ui/Popover'
import { MultiSelect } from '@/shared/ui/MultiSelect'


import userInfo from '@/shared/assets/icons/user-info.svg'
import calendarIcon from '@/shared/assets/icons/calendar.svg'

import styles from './ProfileForm.module.css'

interface ProfileFormProps {
  onSubmit: (data: {
    name: string
    birthDate: Date | undefined
    gender: string
    city: string
    categories: SkillCategoryId[]
    subcategories: SkillSubcategoryId[]
  }) => void
    handleBack: () => void
    errors?: {
      name?: string
      birthDate?: string
      gender?: string
      city?: string
      categories?: string
      subcategories?: string
    }
    savedValues?: {
      name: string
      birthDate: string
      gender: Gender | null
      cityId: string
      learningCategoryIds: SkillCategoryId[]
      learningSubcategoryIds: SkillSubcategoryId[]
    }
  }

type Category = {
  id: string
  name: string
  subcategories: { id: string; name: string }[]
}

type City = { id: string; name: string }

export function ProfileForm({ onSubmit, handleBack, errors, savedValues }: ProfileFormProps) {
  const [name, setName] = useState(savedValues?.name || '')
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    savedValues?.birthDate ? new Date(savedValues.birthDate) : undefined
  )
  const [gender, setGender] = useState(savedValues?.gender || '')
  const [city, setCity] = useState<string>(savedValues?.cityId || '')
  const [categories, setCategories] = useState<SkillCategoryId[]>(
    savedValues?.learningCategoryIds || []
  )
  const [subcategories, setSubcategories] = useState<SkillSubcategoryId[]>(
    savedValues?.learningSubcategoryIds || []
  )

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

          <div>
            <FormField id="name" label="Имя">
              <Input id="name" value={name} onChange={setName} placeholder="Введите ваше имя" />
            </FormField>
            {errors?.name && <p  className={styles.errorHint} >{errors.name}</p>}
          </div>

          <div className={styles.rowInputs}>
            <div>
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

                      <img src={calendarIcon} alt="" className={styles.dateIcon} />
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
              </FormField>
              {errors?.birthDate && <p className={styles.errorHint}>{errors.birthDate}</p>}
            </div>

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
                placeholder="Не выбрано"
              />
              {errors?.gender && <p className={styles.errorHint}>{errors.gender}</p>}
            </div>
          </div>

          <div>
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
            {errors?.city && <p className={styles.errorHint}>{errors.city}</p>}
          </div>

          <div>
            <MultiSelect
              id="categories"
              label="Категория навыка, которому хотите научиться"
              options={categoryOptions}
              selectedValues={categories}
              onChange={setCategories}
              placeholder="Выберите категорию"
            />
            {errors?.categories && <p className={styles.errorHint}>{errors.categories}</p>}
          </div>

          <div>
            <MultiSelect
              id="subcategories"
              label="Подкатегория навыка, которому хотите научиться"
              options={subcategoryOptions}
              selectedValues={subcategories}
              onChange={setSubcategories}
              placeholder="Выберите подкатегорию"
            />
            {errors?.subcategories && <p className={styles.errorHint}>{errors.subcategories}</p>}
          </div>

          <div className={styles.buttonContainer}>
            <Button type="button" variant="secondary" className={styles.button} onClick={handleBack}>
              Назад
            </Button>
            <Button type="submit" className={styles.button}>Продолжить</Button>
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
