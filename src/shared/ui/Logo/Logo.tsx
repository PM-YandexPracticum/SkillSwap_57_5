import clsx from 'clsx'
import { Link } from 'react-router-dom'

import logo from '@/shared/assets/icons/Logo.png'
import type { LogoProps } from '@/shared/model/uiTypes'

import styles from './Logo.module.css'

export function Logo({ className }: LogoProps) {
  return (
    <Link to="/" className={clsx(styles.logoButton, className)} aria-label="SkillSwap">
      <img src={logo} alt="SkillSwap" className={styles.logo} />
    </Link>
  )
}
