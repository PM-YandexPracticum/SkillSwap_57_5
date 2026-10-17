import clsx from 'clsx'
import { Link } from 'react-router-dom'

import logo from '@/shared/assets/icons/Logo.png'
import type { LogoProps } from './types'

import styles from './Logo.module.css'

export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={clsx(styles.logoButton, className)}
      aria-label="SkillSwap"
    >
      <img src={logo} alt="SkillSwap" className={styles.logo} />
    </Link>
  )
}
