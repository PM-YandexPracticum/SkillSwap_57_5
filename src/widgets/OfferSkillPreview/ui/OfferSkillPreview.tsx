import { Button } from '@/shared/ui/Button'

import { Gallery } from '@/shared/ui/Gallery'

import editIcon from '@/shared/assets/icons/edit.svg'
import styles from './OfferSkillPreview.module.css'

interface OfferSkillPreviewProps {
  // Данные из useRegistrationPreview
  title: string
  description: string
  categoryName: string
  subcategoryName: string
  imageUrls: string[]

  // Обработчики кнопок "Редактировать" и "Готово"
  onEditButton: () => void
  onConfirmButton: () => void
}

export function OfferSkillPreview({
  // Данные из useRegistrationPreview
  title,
  description,
  categoryName,
  subcategoryName,
  imageUrls,

  // Обработчики кнопок "Редактировать" и "Готово"
  onEditButton,
  onConfirmButton,
}: OfferSkillPreviewProps) {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.blockTitle}>Ваше предложение</h2>
        <p className={styles.blockSubtitle}>
          Пожалуйста, проверьте и подтвердите правильность данных
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.textContainer}>
            <p className={styles.title}>{title}</p>
            <p className={styles.category}>
              {categoryName} / {subcategoryName}
            </p>
            <p className={styles.description}>{description}</p>
          </div>
          <div className={styles.buttonContainer}>
            <Button variant="secondary" className={styles.button} onClick={onEditButton}>
              Редактировать
              <img alt="" aria-hidden="true" src={editIcon} className={styles.buttonIcon} />
            </Button>
            <Button className={styles.button} onClick={onConfirmButton}>
              Готово
            </Button>
          </div>
        </div>

        <div className={styles.gallery}>
          <Gallery imageUrls={imageUrls} />
        </div>
      </div>
    </section>
  )
}
