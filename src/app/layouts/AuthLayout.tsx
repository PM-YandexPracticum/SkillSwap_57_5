import { Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '@/shared/ui/Logo';
import { IconButton } from '@/shared/ui/IconButton';
import closeIcon from '@/shared/assets/icons/cross.svg';

import styles from './AuthLayout.module.css';

export function AuthLayout() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/'); 
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Logo />
        <IconButton
          src={closeIcon}
          onClick={handleClose}
          ariaLabel="Закрыть"
        />
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
