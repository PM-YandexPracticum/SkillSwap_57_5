import type { CategoryListProps } from '../model/types'

import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/shared/lib/categoryAssets'

import styles from './CategoryList.module.css'

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className={styles.categoryList}>
      {categories.map((cat) => (
        <div key={cat.id} className={styles.caytegory}>
          <div className={styles.iconWrapper} style={{ backgroundColor: CATEGORY_COLORS[cat.id] }}>
            <img src={CATEGORY_ICONS[cat.id]} alt="" />
          </div>

          <div className={styles.content}>
            <h3 className={styles.title}>{cat.name}</h3>

            <ul className={styles.subcategories}>
              {cat.subcategories.map((subcategory) => (
                <li key={subcategory.id}>{subcategory.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
