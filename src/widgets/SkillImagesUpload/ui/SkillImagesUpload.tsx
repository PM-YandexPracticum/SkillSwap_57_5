import { useRef, useState } from 'react'

import { SkillImagePreview } from './SkillImagePreview'
import galleryAddIcon from '../../../shared/assets/icons/gallery-add.svg'

import styles from './SkillImagesUpload.module.css'

interface SkillImagesUploadProps {
  onFilesSelected: (files: File[]) => void
}

export function SkillImagesUpload({ onFilesSelected }: SkillImagesUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  //Добавление файлов
  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles = Array.from(selectedFiles).filter((file) => file.type.startsWith('image/'))

    const updatedFiles = [...files, ...newFiles]

    setFiles(updatedFiles)
    onFilesSelected(updatedFiles)
  }

  //Удаление изображения
  const handleRemoveImage = (index: number) => {
    const updatedFiles = files.filter((_, imageIndex) => imageIndex !== index)

    setFiles(updatedFiles)
    onFilesSelected(updatedFiles)
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
        accept="image/*"
        multiple
        onChange={handleFileChange}
        hidden
      />

      <div
        className={`${styles.dropzone} ${isDragging ? styles.active : ''}`}
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Перетащите или выберите изображение навыка</p>

        <span className={styles.selectImages}>
          <img src={galleryAddIcon} alt="" />
          Выбрать изображения
        </span>
      </div>

      {files.length > 0 && (
        <>
          <div className={styles.previews}>
            {files.map((file, index) => (
              <SkillImagePreview
                key={index}
                file={file}
                onRemove={() => handleRemoveImage(index)}
              />
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
