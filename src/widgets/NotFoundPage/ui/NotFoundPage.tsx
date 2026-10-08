import { Link } from 'react-router-dom'
import { InfoBlock } from '@/shared/ui/InfoBlock'
import { Button } from '@/shared/ui/Button'
import notFoundIcon from '@/shared/assets/icons/not-found.svg'

import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <div className={styles.container}>
      <InfoBlock
        src={notFoundIcon}
        alt="Иллюстрация ошибки 404"
        title="Страница не найдена"
        description="К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже"
      />
      <div className={styles.buttons}>
        <Button variant="secondary">Сообщить об ошибке</Button>
        <Link to="/" className={styles.link}>
          <Button variant="primary">На главную</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage