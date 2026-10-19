import searchIcon from '@/shared/assets/icons/search.svg'

import { useSearchSkills } from '../model/useSearchSkills'

import styles from './SearchSkills.module.css'

export function SearchSkills() {
  const { searchQuery, setSearchQuery } = useSearchSkills()

  return (
    <div className={styles.searchWrapper}>
      <img src={searchIcon} alt="" aria-hidden="true" className={styles.searchIcon} />

      <input
        type="search"
        className={styles.searchInput}
        placeholder="Искать навык"
        aria-label="Поиск навыка"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </div>
  )
}
