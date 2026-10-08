export type SkillCategoryId = string

export type SkillSubcategoryId = string

export interface CategoryListProps {
  categories: SkillCategory[]
}

// Описывает категорию навыков, например Творчество и искусство
export interface SkillCategory {
  id: SkillCategoryId
  name: string
  subcategories: SkillSubcategory[]
}

// Описывает подкатегорию навыков, например Музыка и звук
export interface SkillSubcategory {
  id: SkillSubcategoryId
  name: string
}
