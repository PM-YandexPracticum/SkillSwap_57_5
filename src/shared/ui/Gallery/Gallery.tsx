import clsx from 'clsx'
import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper'

import 'swiper/css'
import 'swiper/css/thumbs'

import { CarouselButton } from '@/shared/ui/CarouselButton'

import type { GalleryProps } from './types'
import styles from './Gallery.module.css'

const MAX_VISIBLE_THUMBS = 3

export function Gallery({ imageUrls }: GalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null)
  const mainSwiperRef = useRef<SwiperClass | null>(null)

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
          modules={[Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper
          }}
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
            <CarouselButton
              direction="left"
              onClick={() => mainSwiperRef.current?.slidePrev()}
              className={clsx(styles.navButton, styles.navPrev)}
            />

            <CarouselButton
              direction="right"
              onClick={() => mainSwiperRef.current?.slideNext()}
              className={clsx(styles.navButton, styles.navNext)}
            />
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
