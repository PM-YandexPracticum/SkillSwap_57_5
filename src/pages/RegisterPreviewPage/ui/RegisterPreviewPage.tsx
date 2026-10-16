// import styles from './RegisterPreviewPage.module.css'
import { useRegistrationPreview } from '@/features/registration/model/useRegistrationPreview'
import { Modal } from '@/shared/ui/Modal'
import { OfferSkillPreview } from '@/widgets/OfferSkillPreview'

export default function RegisterPreviewPage() {
  const data = useRegistrationPreview()

  const modalOpen = true

  if (!data) {
    return null
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
        onConfirm={() => {}}
      />
    </Modal>
  )
}
