import type { City } from '@/entities/city'
import type { User } from '@/entities/user'
import type { SkillCategory, SkillSubcategory } from '@/entities/category'
import type { Skill } from '@/entities/skill'
import type { CatalogUser } from '../model/types'

export function buildCatalogUser(
  user: User,
  skills: Skill[],
  cities: City[],
  allSubcategories: SkillSubcategory[],
  categories: SkillCategory[],
): CatalogUser {
  const teachSkills = skills.filter((skill) => skill.authorId === user.id)
  const city = cities.find((city) => city.id === user.cityId)

  const learnSkills = (user.learningSubcategoryIds ?? [])
    .map((subcategoryId): Skill | null => {
      const subcategory = allSubcategories.find((subcategory) => subcategory.id === subcategoryId)
      if (!subcategory) return null

      const category = categories.find((category) =>
        category.subcategories?.some((subcategory) => subcategory.id === subcategoryId),
      )

      return {
        id: `learn-${subcategoryId}`,
        authorId: user.id,
        title: subcategory.name ?? `Категория ${subcategoryId}`,
        categoryId: category?.id ?? 'unknown',
        subcategoryId,
        description: '',
        imageUrls: [],
      }
    })
    .filter((skill): skill is Skill => skill !== null)

  return {
    user,
    cityName: city?.name ?? 'Город не указан',
    teachSkills,
    learnSkills,
    latestSkillCreatedAt: user.createdAt,
  }
}
