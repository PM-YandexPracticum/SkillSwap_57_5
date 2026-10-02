import type { CatalogUser } from './types'

export function sortUsersByPopularity(
  catalogUsers: CatalogUser[],
  likedUserIds: string[],
): CatalogUser[] {
  const likedUserIdSet = new Set(likedUserIds)

  return [...catalogUsers].sort((firstUser, secondUser) => {
    const firstUserLikeCount =
      firstUser.user.likeCount + (likedUserIdSet.has(firstUser.user.id) ? 1 : 0)

    const secondUserLikeCount =
      secondUser.user.likeCount + (likedUserIdSet.has(secondUser.user.id) ? 1 : 0)

    return secondUserLikeCount - firstUserLikeCount
  })
}

export function sortUsersByNewestSkill(
  catalogUsers: CatalogUser[],
): CatalogUser[] {
  return [...catalogUsers].sort(
    (firstUser, secondUser) =>
      new Date(secondUser.latestSkillCreatedAt).getTime() -
      new Date(firstUser.latestSkillCreatedAt).getTime(),
  )
}

export function sortUsersByRegistrationDate(
  catalogUsers: CatalogUser[],
): CatalogUser[] {
  return [...catalogUsers].sort(
    (firstUser, secondUser) =>
      new Date(secondUser.user.createdAt).getTime() -
      new Date(firstUser.user.createdAt).getTime(),
  )
}
