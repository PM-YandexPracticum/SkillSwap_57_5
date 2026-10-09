import clsx from 'clsx'
import { IconButton } from '../IconButton'
import type { InputWithActionProps } from './types'
import styles from './InputWithAction.module.css'

export const InputWithAction = ({
  children,
  id,
  label,
  actionIconSrc,
  actionLabel,
  onAction,
  showAction,
  disabled,
  className,
  iconButtonClassName,
}: InputWithActionProps) => {
  const wrapperClassName = clsx(styles.wrapper, className)
  const actionClassName = clsx(styles.action, iconButtonClassName)

  return (
    <div className={wrapperClassName}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <div className={styles.field}>
        {children}

        {showAction && (
          <IconButton
            className={actionClassName}
            src={actionIconSrc}
            ariaLabel={actionLabel}
            disabled={disabled}
            onClick={onAction}
          />
        )}
      </div>
    </div>
  )
}
