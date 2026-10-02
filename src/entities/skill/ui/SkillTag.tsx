import type { Skill } from '@/shared/types'

import styles from './SkillTag.module.css'

interface SkillTagProps {
  skill: Skill
}

function getSkillTagClass(categoryId: string): string {
  const categoryClassMap: Record<string, string> = {
    'business-career': styles.businessTag,
    'foreign-languages': styles.languagesTag,
    'home-comfort': styles.homeTag,
    'creativity-art': styles.creativityTag,
    'education-development': styles.educationTag,
    'health-lifestyle': styles.healthTag,
  }

  return categoryClassMap[categoryId] ?? styles.defaultTag
}

export function SkillTag({ skill }: SkillTagProps) {
  return (
    <span
      className={`${styles.skillTag} ${getSkillTagClass(skill.categoryId)}`}
    >
      {skill.title}
    </span>
  )
}
