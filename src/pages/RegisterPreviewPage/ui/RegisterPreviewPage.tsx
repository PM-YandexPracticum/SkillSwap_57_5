import styles from './RegisterPreviewPage.module.css'
import { useCompleteRegistration } from '@/features/registration/model/useCompleteRegistration'
import { useRegistrationPreview } from '@/features/registration/model/useRegistrationPreview'
import { Modal } from '@/shared/ui/Modal'
import { OfferSkillPreview } from '@/widgets/OfferSkillPreview'
import { useNavigate, useLocation } from 'react-router-dom'

export default function RegisterPreviewPage() {
  const data = useRegistrationPreview()

  const { completeRegistration, error } = useCompleteRegistration()
  const navigate = useNavigate()
  const location = useLocation()

  if (!data) {
    return null
  }

  const handleConfirm = () => {
    const success = completeRegistration()
    if (success) {
      navigate('/register/success', {
        state: { backgroundLocation: location.state?.backgroundLocation },
      })
    }
    // при ошибке остаёмся здесь — error покажется ниже
  }

  const handleClose = () => {
    navigate(-1)
  }

  return (
    <Modal
      open
      onClose={handleClose}
      ariaLabel="Предпросмотр предложения"
      className={styles.previewModal}
    >
      <OfferSkillPreview
        title={data.title}
        description={data.description}
        categoryName={data.categoryName}
        subcategoryName={data.subcategoryName}
        imageUrls={data.imageUrls}
        onEdit={handleClose}
        onConfirm={handleConfirm}
      />
      {error && <p className={styles.error}>{error}</p>}
    </Modal>
  )
}
