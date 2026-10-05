import styles from './Loader.module.css'
import spinnerIcon from '@/shared/assets/icons/spinner.png'
import type { LoaderProps } from '../../model/uiTypes'

export const Loader = ({ text, className }: LoaderProps) => {
  const loaderText = text ?? 'Загрузка...'

  return (
    <div className={`${styles.spinnerWrapper} ${className}`}>
      <img className={styles.spinner} src={spinnerIcon} alt="" aria-hidden="true" />
      {loaderText && <p>{loaderText}</p>}
    </div>
  )
}
