import { useEffect, useState, type FormEvent } from 'react'
import type { RegistrationSkillErrors, RegistrationSkillValues } from '@/features/registration'
import { useAppSelector } from '@/store/hooks'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input/Input'
import { Combobox } from '@/shared/ui/Combobox'
import { Textarea } from '@/shared/ui/Textarea/Textarea'
import { Button } from '@/shared/ui/Button'
import { InfoBlock } from '@/shared/ui/InfoBlock'
import easelIcon from '@/shared/assets/icons/easel-illustration.svg'
import styles from './SkillForm.module.css'

interface SkillFormProps {
  onSubmit: (data: RegistrationSkillValues) => Promise<boolean>
  handleBack: () => void
  errors?: RegistrationSkillErrors
  savedValues?: RegistrationSkillValues
}

export function SkillForm({ onSubmit, handleBack, errors, savedValues }: SkillFormProps) {
  const categories = useAppSelector((state) => state.categories.items)
  const [skillName, setSkillName] = useState(savedValues?.title ?? '')
  const [category, setCategory] = useState(savedValues?.categoryId ?? '')
  const [subCategory, setSubCategory] = useState(savedValues?.subcategoryId ?? '')
  const [description, setDescription] = useState(savedValues?.description ?? '')

  useEffect(() => {
    if (savedValues) {
      setSkillName(savedValues.title || '')
      setCategory(savedValues.categoryId || '')
      setSubCategory(savedValues.subcategoryId || '')
      setDescription(savedValues.description || '')
    }
  }, [savedValues])

  const categoryOptions = categories.map((item) => ({
    value: item.id,
    label: item.name,
  }))

  const availableCategories = category
    ? categories.filter((item) => item.id === category)
    : categories

  const subCategoryOptions = availableCategories.flatMap((item) =>
    item.subcategories.map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.name,
    })),
  )

  // ИСПРАВЛЕНО: Безопасное связывание без багов асинхронности React
  const handleCategoryChange = (newCategoryId: string) => {
    setCategory(newCategoryId)

    const nextCategory = categories.find((item) => item.id === newCategoryId)
    if (!nextCategory?.subcategories.some((item) => item.id === subCategory)) {
      setSubCategory('')
    }
  }

  const handleSubCategoryChange = (subgetid: string) => {
    setSubCategory(subgetid)

    if (subgetid) {
      const parentCategory = categories.find((item) =>
        item.subcategories.some((subcategory) => subcategory.id === subgetid),
      )

      if (parentCategory) setCategory(parentCategory.id)
    }
  }

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
              <span style={{ color: '#dc2626', fontSize: '11px', display: 'block', marginTop: '4px', paddingLeft: '4px' }} role="alert">
                {errors.title}
              </span>
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
              <span style={{ color: '#dc2626', fontSize: '11px', display: 'block', marginTop: '4px', paddingLeft: '4px' }} role="alert">
                {errors.categoryId}
              </span>
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
              <span style={{ color: '#dc2626', fontSize: '11px', display: 'block', marginTop: '#dc2626', paddingLeft: '4px' }} role="alert">
                {errors.subcategoryId}
              </span>
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
              /* ИСПРАВЛЕНО: Убрали опечатку хэша цвета из marginTop, вернули пиксели */
              <span style={{ color: '#dc2626', fontSize: '11px', display: 'block', marginTop: '4px', paddingLeft: '4px' }} role="alert">
                {errors.description}
              </span>
            )}
          </FormField>

          {/* ИСПРАВЛЕНО: Убран неактуальный по ТЗ компонент SkillImagesUpload */}

          <div className={styles.buttonWrapper}>
            <Button
              type="button"
              variant="secondary"
              className={styles.button}
              onClick={handleBack}
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
