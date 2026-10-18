import clsx from 'clsx'
import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { Thumbs } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/thumbs'

import { CarouselButton } from '@/shared/ui/CarouselButton'

import type { GalleryProps } from './types'
import styles from './Gallery.module.css'

const MAX_VISIBLE_THUMBS = 3

export function Gallery({ imageUrls }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const mainSwiperRef = useRef<SwiperInstance | null>(null)
  const thumbsSwiperRef = useRef<SwiperInstance | null>(null)

  if (imageUrls.length === 0) {
    return <p className={styles.empty}>Нет фотографий</p>
  }

  const hasMultipleImages = imageUrls.length > 1
  const visibleThumbs = imageUrls.slice(0, MAX_VISIBLE_THUMBS)
  const hiddenThumbsCount = imageUrls.length - MAX_VISIBLE_THUMBS

  const goTo = (index: number) => {
    const safeIndex = Math.max(0, Math.min(imageUrls.length - 1, index))
    setActiveIndex(safeIndex)

    mainSwiperRef.current?.slideTo(safeIndex, 0)
    thumbsSwiperRef.current?.slideTo(Math.min(safeIndex, visibleThumbs.length - 1), 0)
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainWrapper}>
        <Swiper
          modules={[Thumbs]}
          className={styles.mainSwiper}
          initialSlide={activeIndex}
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper
            swiper.slideTo(activeIndex, 0)
          }}
        >
          {imageUrls.map((imageUrl) => (
            <SwiperSlide key={imageUrl}>
              <img className={styles.mainImage} src={imageUrl} alt="" loading="lazy" />
            </SwiperSlide>
          ))}
        </Swiper>

        {hasMultipleImages && (
          <>
            <CarouselButton
              direction="left"
              onClick={() => goTo(activeIndex - 1)}
              className={clsx(styles.navButton, styles.navPrev)}
            />
            <CarouselButton
              direction="right"
              onClick={() => goTo(activeIndex + 1)}
              className={clsx(styles.navButton, styles.navNext)}
            />
          </>
        )}
      </div>

      <div className={styles.thumbsWrapper}>
        <Swiper
          modules={[Thumbs]}
          className={styles.thumbsSwiper}
          direction="vertical"
          slidesPerView={MAX_VISIBLE_THUMBS}
          spaceBetween={24}
          watchSlidesProgress
          allowTouchMove={false}
          initialSlide={Math.min(activeIndex, visibleThumbs.length - 1)}
          onSwiper={(swiper) => {
            thumbsSwiperRef.current = swiper
            swiper.slideTo(Math.min(activeIndex, visibleThumbs.length - 1), 0)
          }}
        >
          {visibleThumbs.map((imageUrl, index) => {
            const isLastVisible = index === visibleThumbs.length - 1
            const showOverlay = isLastVisible && hiddenThumbsCount > 0

            return (
              <SwiperSlide key={imageUrl} className={styles.thumbSlide} onClick={() => goTo(index)}>
                <img className={styles.thumbImage} src={imageUrl} alt="" />
                {showOverlay && <span className={styles.thumbOverlay}>+{hiddenThumbsCount}</span>}
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}
