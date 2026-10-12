import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input/Input'
import { Combobox } from '@/shared/ui/Combobox'
import { Textarea } from '@/shared/ui/Textarea/Textarea'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { InfoBlock } from '@/shared/ui/InfoBlock' // Готовый компонент по ТЗ

import { SkillImagesUpload } from '@/widgets/SkillImagesUpload'
import easelIcon from '@/shared/assets/icons/easel-illustration.svg' // Наш новый правильный SVG

import styles from './SkillForm.module.css'

export function SkillForm() {
  const navigate = useNavigate()

  const [skillName, setSkillName] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [description, setDescription] = useState('')
  
  const [, setSelectedFiles] = useState<File[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categoryOptions = [
    { value: 'it', label: 'IT и программирование' },
    { value: 'design', label: 'Дизайн' },
    { value: 'languages', label: 'Иностранные языки' },
  ]

  const subCategoryOptions = [
    { value: 'frontend', label: 'Frontend-разработка' },
    { value: 'backend', label: 'Backend-разработка' },
    { value: 'uiux', label: 'UI/UX Дизайн' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  return (
    <section className={styles.container}>
      {/* Левая колонка — Форма регистрации навыка */}
      <div className={styles.formColumn}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <FormField id="skill-name" label="Название навыка">
            <Input
              id="skill-name"
              value={skillName}
              onChange={setSkillName}
              placeholder="Введите название вашего навыка"
            />
          </FormField>

          <FormField id="category" label="Категория навыка">
            <Combobox
              id="category"
              value={category}
              onChange={setCategory}
              placeholder="Выберите категорию навыка"
              options={categoryOptions}
            />
          </FormField>

          <FormField id="subcategory" label="Подкатегория навыка">
            <Combobox
              id="subcategory"
              value={subCategory}
              onChange={setSubCategory}
              placeholder="Выберите подкатегорию навыка"
              options={subCategoryOptions}
            />
          </FormField>

          <FormField id="description" label="Описание">
            <Textarea
              id="description"
              value={description}
              onChange={setDescription}
              placeholder="Коротко опишите, чему можете научить"
            />
          </FormField>

          <SkillImagesUpload onFilesSelected={setSelectedFiles} />

          <div className={styles.buttonWrapper}>
            <Button
              type="button"
              variant="secondary"
              className={styles.button}
              onClick={() => navigate('/register/profile')}
            >
              Назад
            </Button>
            <Button type="submit" variant="primary" className={styles.button}>
              Продолжить
            </Button>
          </div>
        </form>
      </div>

      {/* Правая колонка — Передаем данные в универсальный InfoBlock */}
      <div className={styles.infoColumn}>
        <InfoBlock 
          src={easelIcon}
          title="Укажите, чем вы готовы поделиться"
          description="Так другие люди смогут увидеть ваши предложения и предложить вам обмен!"
          variant="registration"
        />
      </div>

      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        ariaLabel="Окно успешного завершения регистрации"
      >
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Регистрация завершена!</h2>
          <Button onClick={() => setIsModalOpen(false)}>Отлично</Button>
        </div>
      </Modal>
    </section>
  )
}
