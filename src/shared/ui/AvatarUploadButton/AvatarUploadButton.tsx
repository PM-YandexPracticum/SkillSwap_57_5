import clsx from 'clsx'
import { useRef } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import addIcon from '@/shared/assets/icons/add.svg'
import styles from './AvatarUploadButton.module.css'

interface AvatarUploadButtonProps {
  onAvatarChange?: (file: File) => void
  className?: string
}

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
      <IconButton src={addIcon} ariaLabel="Загрузить аватар" onClick={handleClick} />
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className={styles.hiddenInput}
      />
    </div>
  )
}
