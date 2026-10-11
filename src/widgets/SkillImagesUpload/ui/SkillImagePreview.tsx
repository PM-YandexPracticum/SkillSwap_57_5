import { useEffect, useState } from 'react'

import styles from './SkillImagePreview.module.css'

interface SkillImagePreviewProps {
  file: File
  onRemove: () => void
}

export function SkillImagePreview({ file, onRemove }: SkillImagePreviewProps) {
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
      >х</button>
    </div>
  )
}
