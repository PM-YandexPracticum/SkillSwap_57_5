import type {
  CatalogCardData,
  CatalogUser,
} from '../model/types'

export function sortCatalogUsersByPopularity(
  catalogUsers: CatalogCardData[],
): CatalogCardData[] {
  return [...catalogUsers].sort(
    (firstUser, secondUser) =>
      secondUser.displayedLikeCount -
      firstUser.displayedLikeCount,
  )
}

export function sortCatalogUsersByNewestSkill<
  T extends CatalogUser,
>(catalogUsers: T[]): T[] {
  return [...catalogUsers].sort(
    (firstUser, secondUser) =>
      new Date(secondUser.latestSkillCreatedAt).getTime() -
      new Date(firstUser.latestSkillCreatedAt).getTime(),
  )
}

export function sortCatalogUsersByRegistrationDate<
  T extends CatalogUser,
>(catalogUsers: T[]): T[] {
  return [...catalogUsers].sort(
    (firstUser, secondUser) =>
      new Date(secondUser.user.createdAt).getTime() -
      new Date(firstUser.user.createdAt).getTime(),
  )
}
