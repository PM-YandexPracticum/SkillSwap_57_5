import { useRef } from 'react'
import styles from './RegisterPreviewPage.module.css'
import { useCompleteRegistration, useRegistrationPreview } from '@/features/registration'
import { Modal } from '@/shared/ui/Modal'
import { OfferRegistrationPreview } from '@/widgets/OfferRegistrationPreview'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export default function RegisterPreviewPage() {
  const navigate = useNavigate()

  const returnPath = useAppSelector((state) => state.users.returnPath)

  const isSubmittingRef = useRef(false)

  const data = useRegistrationPreview()

  const { completeRegistration, error } = useCompleteRegistration()

  if (!data) {
    return null
  }

  const handleConfirm = async () => {
    // Защита от двойного срабатывания при подтверждении регистрации
    if (isSubmittingRef.current) return

    isSubmittingRef.current = true

    try {
      const success = await completeRegistration()
      if (success) {
        // Открываем окно успеха поверх исходной страницы навыка или главной
        navigate('/register/success', {
          state: { backgroundLocation: { pathname: returnPath } },
        })
      }
      // при ошибке остаёмся здесь, error покажется ниже
    } finally {
      isSubmittingRef.current = false
    }
  }

  // Закрываем предпросмотр и возвращаемся к третьему шагу регистрации
  const handleClose = () => {
    navigate('/register/skill', { replace: true })
  }

  return (
    <Modal
      open
      onClose={handleClose}
      ariaLabel="Предпросмотр предложения"
      className={styles.previewModal}
    >
      <OfferRegistrationPreview
        title={data.title}
        description={data.description}
        categoryName={data.categoryName}
        subcategoryName={data.subcategoryName}
        imageUrls={data.imageUrls}
        onEditButton={handleClose}
        onConfirmButton={handleConfirm}
      />
      {error && <p className={styles.error}>{error}</p>}
    </Modal>
  )
}
