import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import { format } from 'date-fns'
import 'react-day-picker/style.css'

import type { SkillCategoryId, SkillSubcategoryId } from '@/entities/category'
import type { Gender } from '@/entities/user'
import type { RegistrationProfileValues, RegistrationProfileErrors } from '@/features/registration'

import { useAppSelector } from '@/store/hooks'

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
  // Данные и обработчики из useRegistrationProfile
  onSubmit: (data: RegistrationProfileValues) => Promise<boolean>
  errors?: RegistrationProfileErrors
  savedValues?: {
    name: string
    birthDate: string
    gender: Gender | null
    cityId: string
    learningCategoryIds: SkillCategoryId[]
    learningSubcategoryIds: SkillSubcategoryId[]
  }
  avatarFile: File | null
  onAvatarChange: (file: File) => void

  // Обработчик навигации для кнопки "Назад"
  onBackButton: () => void
}

export function ProfileForm({
  // Данные и обработчики из useRegistrationProfile
  onSubmit,
  errors,
  savedValues,
  avatarFile,
  onAvatarChange,

  // Обработчик навигации для кнопки "Назад"
  onBackButton,
}: ProfileFormProps) {
  const [name, setName] = useState(savedValues?.name || '')
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    savedValues?.birthDate ? new Date(savedValues.birthDate) : undefined,
  )
  const [gender, setGender] = useState(savedValues?.gender || '')
  const [city, setCity] = useState<string>(savedValues?.cityId || '')
  const [categories, setCategories] = useState<SkillCategoryId[]>(
    savedValues?.learningCategoryIds || [],
  )
  const [subcategories, setSubcategories] = useState<SkillSubcategoryId[]>(
    savedValues?.learningSubcategoryIds || [],
  )
  const [manuallySelectedCategories, setManuallySelectedCategories] = useState<SkillCategoryId[]>(
    savedValues?.learningCategoryIds || [],
  )

  const categoriesData = useAppSelector((state) => state.categories.items)
  const citiesData = useAppSelector((state) => state.cities.items)

  // Формируем опции для поля выбора категорий MultiSelect
  const categoryOptions = categoriesData.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))
  // Формируем опции подкатегорий MultiSelect с учётом выбранных вручную категорий
  const subcategoryOptions = categoriesData
    .filter(
      (cat) =>
        manuallySelectedCategories.length === 0 || manuallySelectedCategories.includes(cat.id),
    )
    .flatMap((cat) =>
      cat.subcategories.map((sub) => ({
        value: sub.id,
        label: sub.name,
      })),
    )
  // Формируем опции для поля выбора города Combobox
  const cityOptions = citiesData.map((city) => ({
    value: city.id,
    label: city.name,
  }))

  // Обновляем категории и убираем подкатегории удалённых категорий
  const handleCategoryToggle = (newCategories: SkillCategoryId[]) => {
    const removedCategories = categories.filter((id) => !newCategories.includes(id))

    if (removedCategories.length > 0) {
      const removedSubIds = categoriesData
        .filter((cat) => removedCategories.includes(cat.id))
        .flatMap((cat) => cat.subcategories.map((sub) => sub.id))

      setSubcategories((prev) => prev.filter((id) => !removedSubIds.includes(id)))
    }

    setCategories(newCategories)
    setManuallySelectedCategories(newCategories)
  }

  // Обновляем подкатегории и добавляем соответствующие им категории
  const handleSubcategoryToggle = (newSubcategories: SkillSubcategoryId[]) => {
    const addedSubcategories = newSubcategories.filter((id) => !subcategories.includes(id))

    if (addedSubcategories.length > 0) {
      const parentCategoryIds = categoriesData
        .filter((cat) => cat.subcategories.some((sub) => addedSubcategories.includes(sub.id)))
        .map((cat) => cat.id)

      const newCategories = [...categories]
      parentCategoryIds.forEach((id) => {
        if (!newCategories.includes(id)) {
          newCategories.push(id)
        }
      })

      if (newCategories.length !== categories.length) {
        setCategories(newCategories)
      }
    }

    setSubcategories(newSubcategories)
  }

  // Собираем значения полей формы и передаём их в onSubmit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({ name, birthDate, gender, city, categories, subcategories })
  }

  // Закрываем календарь выбора даты
  const closePopover = () => {
    const event = new MouseEvent('pointerdown', { bubbles: true })
    document.dispatchEvent(event)
  }

  return (
    <section className={styles.container}>
      <div className={styles.contentContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.avatarButtonWrapper}>
            <AvatarUploadButton onAvatarChange={onAvatarChange} file={avatarFile} />
            {errors?.avatar && <p className={styles.errorHint}>{errors.avatar}</p>}
          </div>

          <div>
            <FormField id="name" label="Имя">
              <Input id="name" value={name} onChange={setName} placeholder="Введите ваше имя" />
            </FormField>
            {errors?.name && <p className={styles.errorHint}>{errors.name}</p>}
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
                          // Сбрасываем дату и закрываем календарь
                          setBirthDate(undefined)
                          closePopover()
                        }}
                      >
                        Отменить
                      </Button>
                      <Button
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
              onChange={handleCategoryToggle}
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
              onChange={handleSubcategoryToggle}
              placeholder="Выберите подкатегорию"
            />
            {errors?.subcategories && <p className={styles.errorHint}>{errors.subcategories}</p>}
          </div>

          <div className={styles.buttonContainer}>
            <Button
              type="button"
              variant="secondary"
              className={styles.button}
              onClick={onBackButton}
            >
              Назад
            </Button>
            <Button type="submit" className={styles.button}>
              Продолжить
            </Button>
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
