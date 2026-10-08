import styles from './InfoBlock.module.css'
import type { InfoBlockProps } from '@/shared/model/uiTypes'

export function InfoBlock({
  src,
  alt,
  title,
  description,
  className,
  variant = 'registration',
}: InfoBlockProps) {
  const baseClass = `${styles.container} ${styles[variant]}`
  const containerClassName = className ? `${baseClass} ${className}` : baseClass

  return (
    <div className={containerClassName}>
      <img src={src} alt={alt ?? title} className={styles.image} loading="lazy" />
      <div className={styles.textContainer}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
