import { useRef, useState, type ChangeEvent } from 'react'

import GalleryEditIcon from '@/shared/assets/icons/gallery-edit.svg'

import styles from './ProfileAvatar.module.css'

export function ProfileAvatar() {
  const [avatar, setAvatar] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        {avatar ? (
          <img src={avatar} alt="Аватар пользователя" className={styles.image} />
        ) : (
          <span className={styles.placeholder}>Фото</span>
        )}

        <button
          type="button"
          className={styles.editButton}
          onClick={() => inputRef.current?.click()}
          aria-label="Изменить фотографию"
        >
          <img src={GalleryEditIcon} alt="" className={styles.editIcon} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        className={styles.fileInput}
        onChange={handleFileChange}
        aria-label="Загрузить аватар"
      />
    </div>
  )
}
