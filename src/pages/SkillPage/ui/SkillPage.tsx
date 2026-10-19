import styles from './SkillPage.module.css'
import { SkillAuthorCard } from '@/widgets/SkillAuthorCard'
import { SkillInfo } from '@/widgets/SkillInfo'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSkillPage } from '../model/useSkillPage'
import { SimilarOffers } from './SimilarOffers'
import { NotFoundError } from '@/widgets/NotFoundError'
import { useAppDispatch } from '@/store/hooks'
import { setReturnPath } from '@/store/slices/usersSlice'
import { useProposeExchange } from '@/features/propose-exchange'

export default function SkillPage() {
  const skillId = useParams<{ id: string }>().id
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const { data, handleFavoriteToggle, isAuthenticated, likedUserIds } = useSkillPage(skillId)

  const { proposeExchange, canProposeExchange, isAlreadyProposed } = useProposeExchange(data?.skill)

  const isAuthorFavorite = likedUserIds?.includes(data?.author.id ?? '') ?? false

  if (!skillId || !data) {
    return (
      <main className={styles.errorPage}>
        <NotFoundError />
      </main>
    )
  }

  const handleExchange = () => {
    // Сохраняем pathname навыка и отправляем гостя на регистрацию
    if (!isAuthenticated) {
      dispatch(setReturnPath(location.pathname))
      navigate('/register')
      return
    }

    if (!canProposeExchange) return

    proposeExchange()

    navigate(`/skill/${skillId}/exchange`, {
      state: { backgroundLocation: location },
    })
  }

  return (
    <>
      <div className={styles.page}>
        <section className={styles.skillSection}>
          <SkillAuthorCard
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
            canProposeExchange={canProposeExchange}
            isAlreadyProposed={isAlreadyProposed}
          />
        </section>
        <SimilarOffers
          items={data.similarOffers}
          title="Похожие предложения"
          onFavoriteToggle={handleFavoriteToggle}
        />
      </div>
    </>
  )
}
