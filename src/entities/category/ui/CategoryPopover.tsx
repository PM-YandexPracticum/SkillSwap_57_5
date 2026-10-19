import type { ReactNode } from 'react'
import type { SkillCategory } from '../model/types'

import { Popover } from '@/shared/ui/Popover'
import { CategoryList } from './CategoryList'

export interface CategoryPopoverProps {
  categories: SkillCategory[]
  trigger: ReactNode
  placement?: 'top' | 'bottom'
}

export function CategoryPopover({
  categories,
  trigger,
  placement = 'bottom',
}: CategoryPopoverProps) {
  return (
    <Popover trigger={trigger} placement={placement} align="left">
      <CategoryList categories={categories} />
    </Popover>
  )
}
