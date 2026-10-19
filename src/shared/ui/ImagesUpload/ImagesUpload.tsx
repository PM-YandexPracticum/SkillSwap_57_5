import clsx from 'clsx'
import { useRef, useState } from 'react'

import { ImagePreview } from './ImagePreview'
import galleryAddIcon from '@/shared/assets/icons/gallery-add.svg'

import styles from './ImagesUpload.module.css'

interface ImagesUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function ImagesUpload({ files, onFilesChange }: ImagesUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  //Добавление файлов
  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles = Array.from(selectedFiles).filter((file) =>
      ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
    )

    onFilesChange([...files, ...newFiles])
  }

  const handleRemoveImage = (index: number) => {
    const updatedFiles = files.filter((_, imageIndex) => imageIndex !== index)

    onFilesChange(updatedFiles)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files)
    event.target.value = ''
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  //Обработчик вызывается, когда файл находится над зоной загрузки
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  //Обработчик вызывается, когда перетаскиваемый объект покидает зону
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  //Обработчик вызывается при отпускании файла над зоной
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    setIsDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <div className={styles.upload}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={handleFileChange}
        hidden
      />

      <div
        className={clsx(styles.dropzone, isDragging && styles.active)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Перетащите или выберите изображения</p>

        <button type="button" className={styles.selectImages} onClick={handleUploadClick}>
          <img src={galleryAddIcon} alt="" />
          Выбрать изображения
        </button>
      </div>

      {files.length > 0 && (
        <>
          <div className={styles.previews}>
            {files.map((file, index) => (
              <ImagePreview key={index} file={file} onRemove={() => handleRemoveImage(index)} />
            ))}
          </div>

          <button type="button" className={styles.addMore} onClick={handleUploadClick}>
            Добавить ещё
          </button>
        </>
      )}
    </div>
  )
}
