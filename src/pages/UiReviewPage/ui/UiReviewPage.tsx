import { useState } from 'react'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input/Input'
import { Select } from '@/shared/ui/Select/Select'
import { Textarea } from '@/shared/ui/Textarea/Textarea'
import styles from './UiReviewPage.module.css'

export default function UiReviewPage() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <h1 className={styles.title}>FormField</h1>

        <FormField id="review-name" label="Имя">
          <Input
            id="review-name"
            value={name}
            onChange={setName}
            placeholder="Введите ваше имя"
          />
        </FormField>

        <FormField id="review-city" label="Город">
          <Select
            id="review-city"
            value={city}
            onChange={setCity}
            required={false}
            className={styles.select}
          >
            <option value="">Выберите город</option>
            <option value="moscow">Москва</option>
            <option value="saint-petersburg">Санкт-Петербург</option>
          </Select>
        </FormField>

        <FormField id="review-description" label="Описание">
          <Textarea
            id="review-description"
            value={description}
            onChange={setDescription}
            placeholder="Расскажите о себе"
          />
        </FormField>
      </div>
    </main>
  )
}
