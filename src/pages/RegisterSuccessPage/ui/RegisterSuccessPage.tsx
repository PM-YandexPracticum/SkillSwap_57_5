import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearRegistrationSource } from '@/features/registration'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import DoneIcon from '@/shared/assets/icons/done.svg'

import styles from './RegisterSuccessPage.module.css'

export default function RegisterSuccessPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const source = useAppSelector((state) => state.registration.source)
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    dispatch(clearRegistrationSource())
    navigate(source.backgroundLocation ?? '/', { replace: true })
  }

  return (
    <main>
      <Modal
        open={isOpen}
        onClose={handleClose}
        ariaLabel="Предложение создано"
        className={styles.modal}
      >
        <div className={styles.content}>
          <img src={DoneIcon} alt="" className={styles.successIcon} aria-hidden="true" />

          <div className={styles.description}>
            <h1 className={styles.title}>Ваше предложение создано</h1>

            <p className={styles.text}>Теперь вы можете предложить обмен</p>
          </div>

          <Button className={styles.button} onClick={handleClose}>
            Готово
          </Button>
        </div>
      </Modal>
    </main>
  )
}
