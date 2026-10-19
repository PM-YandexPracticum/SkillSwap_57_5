import clsx from 'clsx'
import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from 'react'
import { createPortal } from 'react-dom'

import styles from './Modal.module.css'
import type { ModalProps } from './types'

export const Modal = ({ children, onClose, open, ariaLabel, className }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog || !open) {
      return undefined
    }

    const opener = document.activeElement

    dialog.showModal()
    document.body.classList.add(styles.noScroll)

    return () => {
      if (dialog.open) {
        dialog.close()
      }

      document.body.classList.remove(styles.noScroll)

      if (opener instanceof HTMLElement) {
        opener.focus()
      }
    }
  }, [open])

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    // Не даём браузеру закрыть окно самому: состоянием управляет родитель через open
    event.preventDefault()
    onClose()
  }

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) {
      return
    }

    // Клик по ::backdrop приходит как клик по <dialog>, но за пределами его рамки
    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect()
    const isOutside =
      event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom

    if (isOutside) {
      onClose()
    }
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className={clsx(styles.modal, className)}
      aria-label={ariaLabel}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      {children}
    </dialog>,
    document.body,
  )
}
