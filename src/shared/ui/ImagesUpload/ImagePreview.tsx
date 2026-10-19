import { useEffect, useState } from 'react'

import CrossIcon from '@/shared/assets/icons/cross.svg'

import styles from './ImagePreview.module.css'

interface ImagePreviewProps {
  file: File
  onRemove: () => void
}

export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    const url = URL.createObjectURL(file)

    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    <div className={styles.preview}>
      {previewUrl && <img className={styles.image} src={previewUrl} alt={file.name} />}
      <button
        type="button"
        className={styles.remove}
        onClick={onRemove}
        aria-label={`Удалить ${file.name}`}
      >
        <img src={CrossIcon} alt="Удалить изображение" />
      </button>
    </div>
  )
}
