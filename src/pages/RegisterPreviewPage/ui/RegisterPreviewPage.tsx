// import styles from './RegisterPreviewPage.module.css'
import { useCompleteRegistration } from '@/features/registration/model/useCompleteRegistration'
import { useRegistrationPreview } from '@/features/registration/model/useRegistrationPreview'
import { Modal } from '@/shared/ui/Modal'
import { OfferSkillPreview } from '@/widgets/OfferSkillPreview'
import { useNavigate } from 'react-router-dom'

export default function RegisterPreviewPage() {
  const data = useRegistrationPreview()

  const { completeRegistration, error } = useCompleteRegistration()
  const navigate = useNavigate()

  const modalOpen = true

  if (!data) {
    return null
  }

  const handleConfirm = () => {
    const success = completeRegistration()

    if (success) {
      navigate('/register/success')
    }
  }

  return (
    <Modal open={modalOpen} onClose={() => {}} ariaLabel="Предпросмотр предложения">
      <OfferSkillPreview
        title={data.title}
        description={data.description}
        categoryName={data.categoryName}
        subcategoryName={data.subcategoryName}
        imageUrls={data.imageUrls}
        onEdit={() => {}}
        onConfirm={handleConfirm}
      />
      {error && <p>{error}</p>}
    </Modal>
  )
}
