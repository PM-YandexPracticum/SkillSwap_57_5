import { IconButton } from '../IconButton'
import { InputWithActionProps } from './types'
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
  const wrapperClassName = [styles.wrapper, className].filter(Boolean).join(' ')
  const actionClassName = [styles.action, iconButtonClassName].filter(Boolean).join(' ')

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
