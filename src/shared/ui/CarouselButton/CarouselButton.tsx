import clsx from 'clsx'
import { IconButton } from '../IconButton'
import chevronDownIcon from '@/shared/assets/icons/chevron-down.svg'

import styles from './CarouselButton.module.css'

interface CarouselButtonProps {
  direction: 'left' | 'right'
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function CarouselButton({
  direction,
  onClick,
  disabled = false,
  className,
}: CarouselButtonProps) {
  const buttonClassName = clsx(
    styles.button,
    direction === 'left' ? styles.left : styles.right,
    className,
  )

  return (
    <IconButton
      src={chevronDownIcon}
      ariaLabel={direction === 'left' ? 'Назад' : 'Вперёд'}
      disabled={disabled}
      onClick={onClick}
      className={buttonClassName}
    />
  )
}
