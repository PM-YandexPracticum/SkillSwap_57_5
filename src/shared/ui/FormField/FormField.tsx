import clsx from 'clsx'
import type { FormFieldProps } from '@/shared/model/uiTypes'
import styles from './FormField.module.css'

export function FormField({ id, label, children, className }: FormFieldProps) {
  return (
    <div className={clsx(styles.container, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      {children}
    </div>
  )
}
