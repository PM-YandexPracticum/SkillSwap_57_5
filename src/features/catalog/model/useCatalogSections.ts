import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  sortCatalogUsersByNewestSkill,
  sortCatalogUsersByPopularity,
  sortCatalogUsersByRegistrationDate,
} from '../lib/sortCatalogUsers'

import {
  EXPANDED_SECTION_SIZE,
  INITIAL_RECOMMENDED_SIZE,
  INITIAL_SECTION_SIZE,
  RECOMMENDED_INCREMENT,
} from './constants'

import type { CatalogCardData, CatalogSection, CatalogSectionId } from './types'

const RECOMMENDED_LOADING_DELAY = 1000

interface UseCatalogSectionsResult {
  sections: CatalogSection[]
  isRecommendedLoading: boolean
  setRecommendedLoadMoreElement: (element: HTMLDivElement | null) => void
  toggleSection: (sectionId: CatalogSectionId) => void
}

export function useCatalogSections(catalogUsers: CatalogCardData[]): UseCatalogSectionsResult {
  const [expandedSectionIds, setExpandedSectionIds] = useState<CatalogSectionId[]>([])

  const [recommendedVisibleCount, setRecommendedVisibleCount] = useState(INITIAL_RECOMMENDED_SIZE)

  const [recommendedLoadMoreElement, setRecommendedLoadMoreElement] =
    useState<HTMLDivElement | null>(null)

  const [isRecommendedLoading, setIsRecommendedLoading] = useState(false)

  const recommendedLoadingRef = useRef(false)
  const recommendedLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const popularUsers = useMemo(() => sortCatalogUsersByPopularity(catalogUsers), [catalogUsers])

  const newUsers = useMemo(() => sortCatalogUsersByNewestSkill(catalogUsers), [catalogUsers])

  const recommendedUsers = useMemo(
    () => sortCatalogUsersByRegistrationDate(catalogUsers),
    [catalogUsers],
  )

  const isPopularExpanded = expandedSectionIds.includes('popular')

  const isNewExpanded = expandedSectionIds.includes('new')

  const visiblePopularUsers = isPopularExpanded
    ? popularUsers.slice(0, EXPANDED_SECTION_SIZE)
    : popularUsers.slice(0, INITIAL_SECTION_SIZE)

  const visibleNewUsers = isNewExpanded
    ? newUsers.slice(0, EXPANDED_SECTION_SIZE)
    : newUsers.slice(0, INITIAL_SECTION_SIZE)

  const visibleRecommendedUsers = recommendedUsers.slice(0, recommendedVisibleCount)

  // УБРАН СБРОС ЗАГРУЗКИ ПРИ ИЗМЕНЕНИИ catalogUsers:
  // лайк не должен сворачивать список или прерывать показ следующих карточек.
  // useEffect(() => {
  //   setRecommendedVisibleCount(INITIAL_RECOMMENDED_SIZE)
  //   setIsRecommendedLoading(false)
  //   recommendedLoadingRef.current = false

  //   if (recommendedLoadingTimerRef.current !== null) {
  //     clearTimeout(recommendedLoadingTimerRef.current)
  //     recommendedLoadingTimerRef.current = null
  //   }
  // }, [catalogUsers])

  useEffect(() => {
    if (!recommendedLoadMoreElement || recommendedVisibleCount >= recommendedUsers.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry.isIntersecting || recommendedLoadingRef.current) {
          return
        }

        recommendedLoadingRef.current = true
        setIsRecommendedLoading(true)
      },
      {
        rootMargin: '200px',
      },
    )

    observer.observe(recommendedLoadMoreElement)

    return () => {
      observer.disconnect()
    }
  }, [recommendedLoadMoreElement, recommendedUsers.length, recommendedVisibleCount])

  useEffect(() => {
    if (!isRecommendedLoading) {
      return
    }

    recommendedLoadingTimerRef.current = setTimeout(() => {
      setRecommendedVisibleCount((currentVisibleCount) =>
        Math.min(currentVisibleCount + RECOMMENDED_INCREMENT, recommendedUsers.length),
      )

      recommendedLoadingRef.current = false
      setIsRecommendedLoading(false)
      recommendedLoadingTimerRef.current = null
    }, RECOMMENDED_LOADING_DELAY)

    return () => {
      if (recommendedLoadingTimerRef.current !== null) {
        clearTimeout(recommendedLoadingTimerRef.current)
        recommendedLoadingTimerRef.current = null
      }
    }
  }, [isRecommendedLoading, recommendedUsers.length])

  useEffect(() => {
    return () => {
      if (recommendedLoadingTimerRef.current !== null) {
        clearTimeout(recommendedLoadingTimerRef.current)
      }
    }
  }, [])

  const setRecommendedLoadMoreElementRef = useCallback((element: HTMLDivElement | null) => {
    setRecommendedLoadMoreElement(element)
  }, [])

  const toggleSection = (sectionId: CatalogSectionId) => {
    setExpandedSectionIds((currentExpandedSectionIds) => {
      if (currentExpandedSectionIds.includes(sectionId)) {
        return currentExpandedSectionIds.filter(
          (currentSectionId) => currentSectionId !== sectionId,
        )
      }

      return [...currentExpandedSectionIds, sectionId]
    })
  }

  const sections = useMemo<CatalogSection[]>(() => {
    return [
      {
        id: 'popular',
        title: 'Популярное',
        users: visiblePopularUsers,
        showAll: popularUsers.length > INITIAL_SECTION_SIZE,
        isExpanded: isPopularExpanded,
      },
      {
        id: 'new',
        title: 'Новое',
        users: visibleNewUsers,
        showAll: newUsers.length > INITIAL_SECTION_SIZE,
        isExpanded: isNewExpanded,
      },
      {
        id: 'recommended',
        title: 'Рекомендуем',
        users: visibleRecommendedUsers,
        showAll: false,
        isExpanded: false,
      },
    ]
  }, [
    isNewExpanded,
    isPopularExpanded,
    newUsers.length,
    popularUsers.length,
    visibleNewUsers,
    visiblePopularUsers,
    visibleRecommendedUsers,
  ])

  return {
    sections,
    isRecommendedLoading,
    setRecommendedLoadMoreElement: setRecommendedLoadMoreElementRef,
    toggleSection,
  }
}
