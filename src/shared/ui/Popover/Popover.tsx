import { CSSProperties, useState } from 'react'
import { PopoverProps } from './types'
import styles from './popover.module.css'

export const Popover = ({
  trigger,
  children,
  placement = 'bottom',
  align = 'left',
  padding,
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const togglePopover = () => {
    setIsOpen((prev) => !prev)
  }

  const contentClassName = [
    styles.content,
    placement === 'top' && styles.placementTop,
    align === 'center' && styles.alignCenter,
    align === 'right' && styles.alignRight,
  ]
    .filter(Boolean)
    .join(' ')

  const popoverPadding = padding ? ({ '--popover-padding': padding } as CSSProperties) : undefined

  return (
    <div className={styles.wrapper}>
      <div className={styles.triggerWrapper} onClick={togglePopover}>
        {trigger}
      </div>

      {isOpen && (
        <div className={contentClassName} style={popoverPadding}>
          {children}
        </div>
      )}
    </div>
  )
}
