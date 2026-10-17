import styles from './RegisterPreviewPage.module.css'
import { useCompleteRegistration } from '@/features/registration/model/useCompleteRegistration'
import { useRegistrationPreview } from '@/features/registration/model/useRegistrationPreview'
import { Modal } from '@/shared/ui/Modal'
import { OfferSkillPreview } from '@/widgets/OfferSkillPreview'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export default function RegisterPreviewPage() {
  const data = useRegistrationPreview()

  const { completeRegistration, error } = useCompleteRegistration()
  const navigate = useNavigate()
  const source = useAppSelector((state) => state.registration.source)

  if (!data) {
    return null
  }

  const handleConfirm = async () => {
    const success = await completeRegistration()
    if (success) {
      // Открываем окно успеха поверх исходной страницы навыка или главной
      navigate('/register/success', {
        state: { backgroundLocation: { pathname: source.backgroundLocation ?? '/' } },
      })
    }
    // при ошибке остаёмся здесь, error покажется ниже
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
        onEditButton={handleClose}
        onConfirmButton={handleConfirm}
      />
      {error && <p className={styles.error}>{error}</p>}
    </Modal>
  )
}
