import styles from './SkillPage.module.css'
import { SkillAuthor } from '@/widgets/SkillAuthor'
import { SkillInfo } from '@/widgets/SkillInfo'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSkillPage } from '../model/useSkillPage'
import { SimilarOffers } from './SimilarOffers'
import { useAppDispatch } from '@/store/hooks'
import { setRegistrationSource } from '@/features/registration'

export default function SkillPage() {
  const skillId = useParams<{ id: string }>().id
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { data, handleFavoriteToggle, isAuthenticated, likedUserIds } = useSkillPage(skillId)
  const isAuthorFavorite = likedUserIds?.includes(data?.author.id ?? '') ?? false

  if (!skillId || !data) return null

  const handleExchange = () => {
    if (isAuthenticated) {
      navigate(`/skill/${skillId}/exchange`, {
        state: { backgroundLocation: location },
      })
      return
    }

    dispatch(
      setRegistrationSource({
        from: 'skill',
        skillId: skillId,
        backgroundLocation: `/skill/${skillId}`,
      }),
    )

    navigate('/register')
  }

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
            onExchange={handleExchange}
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
