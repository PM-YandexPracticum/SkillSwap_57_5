import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { CatalogCardData } from '@/features/catalog'
import { SkillCard } from '@/widgets/SkillCard'

import 'swiper/css'
import 'swiper/css/navigation'

import styles from './SimilarOffers.module.css'

interface SimilarOffersProps {
  items: CatalogCardData[]
  title: string
  isAuthenticated: boolean
  onFavoriteToggle: (userId: string) => void
}

export function SimilarOffers({
  items,
  title,
  isAuthenticated,
  onFavoriteToggle,
}: SimilarOffersProps) {
  const hasItems = items.length > 0

  return (
    <section>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.content}>
        {hasItems ? (
          <Swiper modules={[Navigation]} navigation slidesPerView={4} spaceBetween={24}>
            {items.map((item) => (
              <SwiperSlide key={item.user.id}>
                <SkillCard
                  user={item.user}
                  cityName={item.cityName}
                  teachSkills={item.teachSkills}
                  learnSkills={item.learnSkills}
                  isFavorite={item.isFavorite}
                  likeCount={item.displayedLikeCount}
                  isAuthenticated={isAuthenticated}
                  onFavoriteToggle={() => onFavoriteToggle(item.user.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>Похожие предложения не найдены</p>
        )}
      </div>
    </section>
  )
}
