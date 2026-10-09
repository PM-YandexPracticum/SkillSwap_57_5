import clsx from 'clsx'
import styles from './InfoBlock.module.css'
import type { InfoBlockProps } from './types'

export function InfoBlock({
  src,
  alt,
  title,
  description,
  className,
  variant = 'registration',
}: InfoBlockProps) {
  const containerClassName = clsx(styles.container, styles[variant], className)

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
