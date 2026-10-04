import type { City } from '@/entities/city'
import type { User } from '@/entities/user'
import type { SkillCategory, SkillSubcategory } from '@/entities/category'
import type { Skill } from '@/entities/skill'
import type { CatalogUser } from '../model/types'

export function buildCatalogUsers(
  users: User[],
  skills: Skill[],
  cities: City[],
  allSubcategories: SkillSubcategory[],
  categories: SkillCategory[],
): CatalogUser[] {
  if (!users) return []

  const categoryIdBySubcategoryId = new Map<string, string>()
  categories.forEach((cat) => {
    cat.subcategories?.forEach((sub) => {
      if (sub.id && cat.id) {
        categoryIdBySubcategoryId.set(sub.id, cat.id)
      }
    })
  })

  const subcategoryById = new Map<string, SkillSubcategory>(
    allSubcategories.map((sub) => [sub.id, sub]),
  )

  const skillsByAuthorId = new Map<string, Skill[]>()
  skills.forEach((skill) => {
    if (!skillsByAuthorId.has(skill.authorId)) {
      skillsByAuthorId.set(skill.authorId, [])
    }
    skillsByAuthorId.get(skill.authorId)!.push(skill)
  })

  const cityNameById = new Map(cities.map((city) => [city.id, city.name]))

  return users
    .map((user) => {
      const teachSkills = skillsByAuthorId.get(user.id) ?? []

      const learnSkills: Skill[] = (user.learningSubcategoryIds ?? [])
        .map((subcategoryId) => {
          const sub = subcategoryById.get(subcategoryId)
          if (!sub) return null

          const categoryId = categoryIdBySubcategoryId.get(sub.id) ?? 'unknown'

          return {
            id: `learn-${subcategoryId}`,
            authorId: user.id,
            title: sub.name ?? `Категория ${subcategoryId}`,
            categoryId,
            subcategoryId,
            description: '',
            imageUrls: [],
          } as Skill
        })
        .filter((s): s is Skill => s !== null)

      return {
        user,
        cityName: cityNameById.get(user.cityId) ?? 'Город не указан',
        teachSkills,
        learnSkills,
        latestSkillCreatedAt: user.createdAt,
      }
    })
    .filter(({ teachSkills, learnSkills }) => teachSkills.length > 0 || learnSkills.length > 0)
}
