import styles from './SkillPage.module.css'
import { SkillAuthor } from '@/widgets/SkillAuthor'
import { SkillInfo } from '@/widgets/SkillInfo'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSkillPage } from '../model/useSkillPage'
import { SimilarOffers } from './SimilarOffers'
import NotFoundPage from '@/pages/NotFoundPage'

export default function SkillPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const skillId = useParams<{ id: string }>().id
  const {
    data,
    handleFavoriteToggle,
    isAuthenticated,
    likedUserIds,
    proposeExchange,
    canProposeExchange,
    isAlreadyProposed,
  } = useSkillPage(skillId)

  const handleProposeExchange = () => {
    if (!canProposeExchange || !skillId) return

    proposeExchange()

    navigate(`/skill/${skillId}/exchange`, {
      state: { backgroundLocation: location },
    })
  }
  const isAuthorFavorite = likedUserIds?.includes(data?.author.id ?? '') ?? false

  if (!skillId || !data) return <NotFoundPage />

  return (
    <>
      <div className={styles.page}>
        <section className={styles.skillSection}>
          <SkillAuthor
            user={data.author}
            cityName={data.city.name}
            teachSkills={data.authorTeachSkills}
            learnSkills={data.authorLearnSkills}
          />
          <SkillInfo
            skill={data.skill}
            author={data.author}
            categoryName={data.categoryName}
            subcategoryName={data.subcategoryName}
            isFavorite={isAuthorFavorite}
            isAuthenticated={isAuthenticated}
            onFavoriteToggle={() => handleFavoriteToggle(data.author.id)}
            onProposeExchange={handleProposeExchange}
            canProposeExchange={canProposeExchange}
            isAlreadyProposed={isAlreadyProposed}
            onLoginRequired={() => navigate('/login')}
          ></SkillInfo>
        </section>
        <SimilarOffers
          items={data.similarOffers}
          title="Похожие предложения"
          isAuthenticated={isAuthenticated}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </div>
    </>
  )
}
