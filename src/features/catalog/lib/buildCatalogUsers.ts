import type { City, Skill, User } from '@/shared/types'

import type { CatalogUser } from '../model/types'

export function buildCatalogUsers(
  users: User[],
  skills: Skill[],
  cities: City[],
): CatalogUser[] {
  const cityNameById = new Map(
    cities.map((city) => [city.id, city.name]),
  )

  return users
    .map((user) => {
      const userSkills = skills.filter(
        (skill) => skill.authorId === user.id,
      )

      const latestSkillCreatedAt = userSkills.reduce(
        (latestDate, skill) =>
          new Date(skill.createdAt).getTime() >
          new Date(latestDate).getTime()
            ? skill.createdAt
            : latestDate,
        userSkills[0]?.createdAt ?? user.createdAt,
      )

      return {
        user,
        cityName: cityNameById.get(user.cityId) ?? 'Город не указан',
        teachSkills: userSkills.filter(
          (skill) => skill.type === 'teach',
        ),
        learnSkills: userSkills.filter(
          (skill) => skill.type === 'learn',
        ),
        latestSkillCreatedAt,
      }
    })
    .filter(
      ({ teachSkills, learnSkills }) =>
        teachSkills.length > 0 || learnSkills.length > 0,
    )
}
