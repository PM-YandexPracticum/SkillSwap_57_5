import { CSSProperties, useEffect, useRef, useState } from 'react'
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
  const popoverRef = useRef<HTMLDivElement>(null)

  const togglePopover = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: PointerEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

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
    <div className={styles.wrapper} ref={popoverRef}>
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
