import styles from './SkillPage.module.css'
import { SkillAuthor } from '@/widgets/SkillAuthor'
import { SkillInfo } from '../../../widgets/SkillInfo/ui/SkillInfo'
import { useParams } from 'react-router-dom'
import { useSkillPage } from '../modal/useSkillPage'
import { SimilarOffers } from './SimilarOffers'

export default function SkillPage() {
  const skillId = useParams<{ id: string }>().id
  const { data } = useSkillPage(skillId)

  if (!skillId) return null
  if (!data) return null

  return (
    <>
      <div className={styles.page}>
        <section className={styles.skillSection}>
          <SkillAuthor
            user={data.author}
            cityName={data.city.name}
            //  Сейчас в навыки у нас передается Skill[] и в тегах SkillTag выводится 
            //  название навыка. Но на макете в тегах названия подкатегорий. 
            //  И в модели пользователя у нас только id подкатегорий которым
            //  он хочет научиться. 
            teachSkills={[data.skill]} // TODO: заменить на подкатегории (названия или ID)
            learnSkills={[data.skill]} // TODO: заменить на подкатегории (названия или ID)
          />
          <SkillInfo
            skill={data.skill}
            author={data.author}
            categoryName={data.categoryName}
            subcategoryName={data.subcategoryName}
            isFavorite={data.isFavorite}
            isAuthenticated={true}
            onFavoriteToggle={() => {}}
          ></SkillInfo>
        </section>
        <SimilarOffers
          items={data.similarOffers}
          title="Похожие предложения"
          isAuthenticated={true}
          onFavoriteToggle={() => {}}
        />
      </div>
    </>
  )
}
