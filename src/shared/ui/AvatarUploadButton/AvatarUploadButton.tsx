import type { AvatarUploadButtonProps } from './types'
import clsx from 'clsx'
import { useRef } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import Icon_and_add from '@/shared/assets/icons/Icon_and_add.svg'
import styles from './AvatarUploadButton.module.css'

export function AvatarUploadButton({
  onAvatarChange = () => {},
  className,
}: AvatarUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
    // TODO: здесь будет логика передачи файла в onAvatarChange
    onAvatarChange(new File([], ''))
  }

  return (
    <div className={clsx(styles.container, className)}>
      <IconButton src={Icon_and_add} ariaLabel="Загрузить аватар" onClick={handleClick} />
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className={styles.hiddenInput}
      />
    </div>
  )
}
