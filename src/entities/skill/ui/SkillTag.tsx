import type { Skill } from '@/entities/skill'

import styles from './SkillTag.module.css'

interface SkillTagProps {
  skill: Skill
}

function getSkillTagClass(categoryId: string): string {
  const categoryClassMap: Record<string, string> = {
    'business-and-career': styles.businessTag,
    'foreign-languages': styles.languagesTag,
    'home-and-comfort': styles.homeTag,
    'creativity-and-art': styles.creativityTag,
    'education-and-development': styles.educationTag,
    'health-and-lifestyle': styles.healthTag,
  }

  return categoryClassMap[categoryId] ?? styles.defaultTag
}

export function SkillTag({ skill }: SkillTagProps) {
  return (
    <span className={`${styles.skillTag} ${getSkillTagClass(skill.categoryId)}`}>
      {skill.title}
    </span>
  )
}
