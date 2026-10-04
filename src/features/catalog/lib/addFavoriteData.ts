import type { CatalogCardData, CatalogUser } from '../model/types'

export function addFavoriteData(
  catalogUsers: CatalogUser[],
  likedUserIds: string[],
): CatalogCardData[] {
  const likedUserIdSet = new Set(likedUserIds)

  return catalogUsers.map((catalogUser) => {
    const isFavorite = likedUserIdSet.has(catalogUser.user.id)

    return {
      ...catalogUser,
      isFavorite,
      displayedLikeCount: catalogUser.user.likesCount + (isFavorite ? 1 : 0),
    }
  })
}
