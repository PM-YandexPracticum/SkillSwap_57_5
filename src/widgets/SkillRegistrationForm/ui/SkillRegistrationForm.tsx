import { useState, type FormEvent } from 'react'
import type { RegistrationSkillErrors, RegistrationSkillValues } from '@/features/registration'
import { useAppSelector } from '@/store/hooks'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'
import { Combobox } from '@/shared/ui/Combobox'
import { Textarea } from '@/shared/ui/Textarea'
import { Button } from '@/shared/ui/Button'
import { InfoBlock } from '@/shared/ui/InfoBlock'
import { SkillImagesUpload } from '@/widgets/SkillImagesUpload'
import easelIcon from '@/shared/assets/icons/easel-illustration.svg'
import styles from './SkillRegistrationForm.module.css'

interface SkillRegistrationFormProps {
  // Данные и обработчики из useRegistrationSkill
  onSubmit: (data: RegistrationSkillValues) => Promise<boolean>
  errors?: RegistrationSkillErrors
  savedValues?: RegistrationSkillValues
  skillImages: File[]
  onSkillImagesChange: (files: File[]) => void

  // Обработчик навигации для кнопки "Назад"
  onBackButton: () => void
}

export function SkillRegistrationForm({
  // Данные и обработчики из useRegistrationSkill
  onSubmit,
  errors,
  savedValues,
  skillImages,
  onSkillImagesChange,

  // Обработчик навигации для кнопки "Назад"
  onBackButton,
}: SkillRegistrationFormProps) {
  const [skillName, setSkillName] = useState(savedValues?.title ?? '')
  const [category, setCategory] = useState(savedValues?.categoryId ?? '')
  const [subCategory, setSubCategory] = useState(savedValues?.subcategoryId ?? '')
  const [description, setDescription] = useState(savedValues?.description ?? '')

  const categories = useAppSelector((state) => state.categories.items)

  // Формируем опции для поля выбора категории Combobox
  const categoryOptions = categories.map((item) => ({
    value: item.id,
    label: item.name,
  }))

  // Оставляем выбранную категорию или все категории, если выбор ещё не сделан
  const availableCategories = category
    ? categories.filter((item) => item.id === category)
    : categories

  // Формируем опции подкатегорий Combobox с учётом выбранной категории
  const subCategoryOptions = availableCategories.flatMap((item) =>
    item.subcategories.map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.name,
    })),
  )

  // Обновляем категорию и сбрасываем подкатегорию, если она относится к другой категории
  const handleCategoryChange = (categoryId: string) => {
    setCategory(categoryId)

    const nextCategory = categories.find((item) => item.id === categoryId)
    if (!nextCategory?.subcategories.some((item) => item.id === subCategory)) {
      setSubCategory('')
    }
  }

  // Обновляем подкатегорию и выбираем соответствующую ей категорию
  const handleSubCategoryChange = (subcategoryId: string) => {
    setSubCategory(subcategoryId)

    if (subcategoryId) {
      const parentCategory = categories.find((item) =>
        item.subcategories.some((subcategory) => subcategory.id === subcategoryId),
      )

      if (parentCategory) setCategory(parentCategory.id)
    }
  }

  // Собираем значения полей формы и передаём их в onSubmit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({
      title: skillName,
      categoryId: category,
      subcategoryId: subCategory,
      description,
    })
  }

  return (
    <section className={styles.container}>
      <div className={styles.formColumn}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <FormField id="skill-name" label="Название навыка">
            <Input
              id="skill-name"
              value={skillName}
              onChange={setSkillName}
              placeholder="Введите название вашего навыка"
              className={errors?.title ? styles.inputError : undefined}
            />
            {errors?.title && (
              <p className={styles.errorHint} role="alert">
                {errors.title}
              </p>
            )}
          </FormField>

          <FormField id="category" label="Категория навыка">
            <Combobox
              id="category"
              value={category}
              onChange={handleCategoryChange}
              placeholder="Выберите категорию навыка"
              options={categoryOptions}
              showAllOnOpen
            />
            {errors?.categoryId && (
              <p className={styles.errorHint} role="alert">
                {errors.categoryId}
              </p>
            )}
          </FormField>

          <FormField id="subcategory" label="Подкатегория навыка">
            <Combobox
              id="subcategory"
              value={subCategory}
              onChange={handleSubCategoryChange}
              placeholder="Выберите подкатегорию навыка"
              options={subCategoryOptions}
              showAllOnOpen
            />
            {errors?.subcategoryId && (
              <p className={styles.errorHint} role="alert">
                {errors.subcategoryId}
              </p>
            )}
          </FormField>

          <FormField id="description" label="Описание">
            <Textarea
              id="description"
              value={description}
              onChange={setDescription}
              placeholder="Коротко опишите, чему можете научить"
              className={errors?.description ? styles.inputError : undefined}
            />
            {errors?.description && (
              <p className={styles.errorHint} role="alert">
                {errors.description}
              </p>
            )}
          </FormField>

          <SkillImagesUpload files={skillImages} onFilesChange={onSkillImagesChange} />
          {errors?.images && (
            <p className={styles.errorHint} role="alert">
              {errors.images}
            </p>
          )}

          <div className={styles.buttonWrapper}>
            <Button
              type="button"
              variant="secondary"
              className={styles.button}
              onClick={onBackButton}
            >
              Назад
            </Button>
            <Button type="submit" variant="primary" className={styles.button}>
              Продолжить
            </Button>
          </div>
        </form>
      </div>

      <div className={styles.infoColumn}>
        <InfoBlock
          src={easelIcon}
          title="Укажите, чем вы готовы поделиться"
          description="Так другие люди смогут увидеть ваши предложения и предложить вам обмен!"
          variant="registration"
        />
      </div>
    </section>
  )
}
