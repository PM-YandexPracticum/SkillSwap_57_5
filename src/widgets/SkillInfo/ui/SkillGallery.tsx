import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import styles from './SkillGallery.module.css'

interface SkillGalleryProps {
  imageUrls: string[]
}

const MAX_VISIBLE_THUMBS = 3

const chevronLeftIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15 5L8 12L15 19"
      stroke="#253017"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const chevronRightIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9 5L16 12L9 19"
      stroke="#253017"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function SkillGallery({ imageUrls }: SkillGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null)
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null)

  if (imageUrls.length === 0) {
    return <p className={styles.empty}>Нет фотографий</p>
  }

  const hasMultipleImages = imageUrls.length > 1
  const visibleThumbs = imageUrls.slice(0, MAX_VISIBLE_THUMBS)
  const hiddenThumbsCount = imageUrls.length - MAX_VISIBLE_THUMBS

  return (
    <div className={styles.gallery}>
      <div className={styles.mainWrapper}>
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation={hasMultipleImages ? { prevEl, nextEl } : false}
          thumbs={{ swiper: thumbsSwiper }}
          className={styles.mainSwiper}
        >
          {imageUrls.map((imageUrl) => (
            <SwiperSlide key={imageUrl}>
              <img className={styles.mainImage} src={imageUrl} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>

        {hasMultipleImages && (
          <>
            <button
              ref={setPrevEl}
              type="button"
              className={`${styles.navButton} ${styles.navPrev}`}
              aria-label="Предыдущая фотография"
            >
              {chevronLeftIcon}
            </button>

            <button
              ref={setNextEl}
              type="button"
              className={`${styles.navButton} ${styles.navNext}`}
              aria-label="Следующая фотография"
            >
              {chevronRightIcon}
            </button>
          </>
        )}
      </div>

      <div className={styles.thumbsWrapper}>
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          direction="vertical"
          slidesPerView={MAX_VISIBLE_THUMBS}
          spaceBetween={24}
          watchSlidesProgress
          allowTouchMove={false}
          className={styles.thumbsSwiper}
        >
          {visibleThumbs.map((imageUrl, index) => {
            const isLastVisible = index === visibleThumbs.length - 1
            const showOverlay = isLastVisible && hiddenThumbsCount > 0

            return (
              <SwiperSlide key={imageUrl} className={styles.thumbSlide}>
                <img className={styles.thumbImage} src={imageUrl} alt="" />
                {showOverlay && (
                  <span className={styles.thumbOverlay}>+{hiddenThumbsCount}</span>
                )}
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}