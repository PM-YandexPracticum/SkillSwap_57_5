import type { ChangeEvent } from 'react'
import type { AvatarUploadButtonProps } from './types'
import clsx from 'clsx'
import { useRef } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import Icon_and_add from '@/shared/assets/icons/Icon_and_add.svg'
import styles from './AvatarUploadButton.module.css'

export function AvatarUploadButton({
  onAvatarChange = () => {},
  className,
  previewUrl,
}: AvatarUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

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