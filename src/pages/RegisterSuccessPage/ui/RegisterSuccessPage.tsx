import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearRegistrationSource } from '@/features/registration'
import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import doneIcon from '@/shared/assets/icons/done.svg'
import styles from './RegisterSuccessPage.module.css'

export default function RegisterSuccessPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const source = useAppSelector((state) => state.registration.source)

  const handleClose = () => {
    const target = source.from === 'skill' && source.skillId ? `/skill/${source.skillId}` : '/'

    dispatch(clearRegistrationSource())
    navigate(target, { replace: true })
  }

  return (
    <Modal
      open
      onClose={handleClose}
      ariaLabel="Регистрация завершена"
      className={styles.successModal}
    >
      <div className={styles.content}>
        <img src={doneIcon} alt="" aria-hidden="true" className={styles.icon} />
        <h2 className={styles.title}>Ваше предложение создано</h2>
        <p className={styles.subtitle}>Теперь вы можете предложить обмен</p>
        <Button className={styles.confirmButton} onClick={handleClose}>
          Готово
        </Button>
      </div>
    </Modal>
  )
}
