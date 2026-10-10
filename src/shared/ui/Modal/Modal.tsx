import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

import styles from './Modal.module.css';
import type { ModalProps } from './types';

export const Modal = ({ children, onClose, ariaLabel, className }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return undefined;
    }

    const opener = document.activeElement;
    const prevOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = prevOverflow;

      if (opener instanceof HTMLElement) {
        opener.focus();
      }
    };
  }, []);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    // Клик по ::backdrop приходит как клик по <dialog>, но за пределами его рамки
    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
    const isOutside =
      event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom;

    if (isOutside) {
      onClose();
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className={[styles.modal, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      {children}
    </dialog>,
    document.body,
  );
};