interface UserWithLikes {
  user: {
    id: string
    likesCount: number
  }
}

export function addFavoriteData<T extends UserWithLikes>(
  catalogUsers: T[],
  likedUserIds: string[],
) {
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
