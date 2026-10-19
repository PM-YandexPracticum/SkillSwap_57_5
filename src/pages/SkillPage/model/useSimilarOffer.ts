import type { CatalogCardData, CatalogUser } from '@/widgets/UserCard'
import { useMemo } from 'react'

export function useSimilarOffers(
  catalogUsers: CatalogUser[],
  subcategoryId: string,
  authorId: string,
): CatalogCardData[] {
  return useMemo(() => {
    const filteredUsers = catalogUsers.filter((user) => {
      if (user.user.id === authorId) return false
      return user.teachSkills.some((skill) => skill.subcategoryId === subcategoryId)
    })

    const uniqueUsers = filteredUsers.reduce<CatalogUser[]>((acc, user) => {
      if (!acc.find((u) => u.user.id === user.user.id)) {
        acc.push(user)
      }
      return acc
    }, [])

    return uniqueUsers.map((user) => ({
      ...user,
      isFavorite: false,
      displayedLikeCount: user.user.likesCount,
    }))
  }, [catalogUsers, subcategoryId, authorId])
}
