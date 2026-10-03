import { useCallback, useEffect, useMemo, useState } from 'react'

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

import type {
  CatalogCardData,
  CatalogSection,
  CatalogSectionId,
} from './types'

interface UseCatalogSectionsResult {
  sections: CatalogSection[]
  setRecommendedLoadMoreElement: (
    element: HTMLDivElement | null,
  ) => void
  toggleSection: (sectionId: CatalogSectionId) => void
}

export function useCatalogSections(
  catalogUsers: CatalogCardData[],
): UseCatalogSectionsResult {
  const [expandedSectionIds, setExpandedSectionIds] = useState<
    CatalogSectionId[]
  >([])

  const [recommendedVisibleCount, setRecommendedVisibleCount] =
    useState(INITIAL_RECOMMENDED_SIZE)

  const [recommendedLoadMoreElement, setRecommendedLoadMoreElement] =
    useState<HTMLDivElement | null>(null)

  const popularUsers = useMemo(
    () => sortCatalogUsersByPopularity(catalogUsers),
    [catalogUsers],
  )

  const newUsers = useMemo(
    () => sortCatalogUsersByNewestSkill(catalogUsers),
    [catalogUsers],
  )

  const recommendedUsers = useMemo(
    () => sortCatalogUsersByRegistrationDate(catalogUsers),
    [catalogUsers],
  )

  const isPopularExpanded =
    expandedSectionIds.includes('popular')

  const isNewExpanded =
    expandedSectionIds.includes('new')

  const visiblePopularUsers = isPopularExpanded
    ? popularUsers.slice(0, EXPANDED_SECTION_SIZE)
    : popularUsers.slice(0, INITIAL_SECTION_SIZE)

  const visibleNewUsers = isNewExpanded
    ? newUsers.slice(0, EXPANDED_SECTION_SIZE)
    : newUsers.slice(0, INITIAL_SECTION_SIZE)

  const visibleRecommendedUsers = recommendedUsers.slice(
    0,
    recommendedVisibleCount,
  )

  useEffect(() => {
    setRecommendedVisibleCount(INITIAL_RECOMMENDED_SIZE)
  }, [catalogUsers])

  useEffect(() => {
    if (
      !recommendedLoadMoreElement ||
      recommendedVisibleCount >= recommendedUsers.length
    ) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry.isIntersecting) {
          return
        }

        setRecommendedVisibleCount((currentVisibleCount) =>
          Math.min(
            currentVisibleCount + RECOMMENDED_INCREMENT,
            recommendedUsers.length,
          ),
        )
      },
      {
        rootMargin: '200px',
      },
    )

    observer.observe(recommendedLoadMoreElement)

    return () => {
      observer.disconnect()
    }
  }, [
    recommendedLoadMoreElement,
    recommendedUsers.length,
    recommendedVisibleCount,
  ])

  const setRecommendedLoadMoreElementRef = useCallback(
    (element: HTMLDivElement | null) => {
      setRecommendedLoadMoreElement(element)
    },
    [],
  )

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
    setRecommendedLoadMoreElement:
      setRecommendedLoadMoreElementRef,
    toggleSection,
  }
}
