import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { resetReturnPath } from '@/store/slices/usersSlice'
import { Logo } from '@/shared/ui/Logo'
import { Button } from '@/shared/ui/Button'
import crossIcon from '@/shared/assets/icons/cross.svg'

import styles from './AuthLayout.module.css'

export function AuthLayout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Сбрасываем pathname возврата при отмене входа или регистрации
  const handleClose = () => {
    dispatch(resetReturnPath())
    navigate('/')
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Logo onClick={handleClose} />
        <Button variant="secondary" onClick={handleClose} className={styles.closeButton}>
          <span>Закрыть</span>
          <img src={crossIcon} alt="" className={styles.icon} />
        </Button>
      </header>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
