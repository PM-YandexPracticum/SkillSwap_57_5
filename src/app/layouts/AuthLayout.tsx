import { Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '@/shared/ui/Logo';
import { Button } from '@/shared/ui/Button'; // Импортируем обычный Button по ТЗ
import crossIcon from '@/shared/assets/icons/cross.svg';

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
        {/* Используем Button со стилем secondary и иконкой внутри */}
        <Button 
          variant="secondary" 
          onClick={handleClose}
          className={styles.closeButton}
        >
          <span>Закрыть</span>
          <img src={crossIcon} alt="" className={styles.icon} />
        </Button>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
