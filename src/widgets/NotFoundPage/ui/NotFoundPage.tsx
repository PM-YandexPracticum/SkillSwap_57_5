import { useNavigate } from 'react-router-dom'
import { InfoBlock } from '@/shared/ui/InfoBlock'
import { Button } from '@/shared/ui/Button'
import notFoundIcon from '@/shared/assets/icons/not-found.svg'

import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <InfoBlock
        variant="error"
        src={notFoundIcon}
        alt="Иллюстрация ошибки 404"
        title="Страница не найдена"
        description="К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже"
      />
      <div className={styles.buttons}>
        <Button variant="secondary" className={styles.button}>
          Сообщить об ошибке
        </Button>
        <Button variant="primary" className={styles.button} onClick={() => navigate('/')}>
          На главную
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
