import type { ChangeEvent } from 'react'
import type { AvatarUploadButtonProps } from './types'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import Icon_and_add from '@/shared/assets/icons/Icon_and_add.svg'
import styles from './AvatarUploadButton.module.css'

export function AvatarUploadButton({
  onAvatarChange = () => {},
  className,
  file,
}: AvatarUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  // Создаём адрес для предпросмотра выбранного аватара
  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // При замене фото или уходе со страницы удаляем из памяти браузера старый blob-адрес предпросмотра аватара
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAvatarChange(file)
    }
    e.target.value = ''
  }

  return (
    <div className={clsx(styles.container, className)}>
      {previewUrl ? (
        <button type="button" className={styles.previewButton} onClick={handleClick}>
          <img src={previewUrl} alt="Аватар" className={styles.preview} />
        </button>
      ) : (
        <IconButton src={Icon_and_add} ariaLabel="Загрузить аватар" onClick={handleClick} />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className={styles.hiddenInput}
        onChange={handleChange}
      />
    </div>
  )
}
