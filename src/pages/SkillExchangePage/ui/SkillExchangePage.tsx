import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'

import NotificationBellIcon from '@/shared/assets/icons/bell.svg'

import styles from './SkillExchangePage.module.css'

export default function SkillExchangePage() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    navigate(-1)
  }

  return (
    <main>
      <Modal
        open={isOpen}
        onClose={handleClose}
        ariaLabel="Обмен предложен"
        className={styles.modal}
      >
        <div className={styles.content}>
          <img src={NotificationBellIcon} alt="" className={styles.notificationBellIcon} />

          <div className={styles.description}>
            <h1 className={styles.title}>Вы предложили обмен</h1>

            <p className={styles.text}>Теперь дождитесь подтверждения. Вам придёт уведомление</p>
          </div>

          <Button className={styles.button} onClick={handleClose}>
            Готово
          </Button>
        </div>
      </Modal>
    </main>
  )
}
