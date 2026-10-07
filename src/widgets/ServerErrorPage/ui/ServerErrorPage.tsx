import { Link } from 'react-router-dom'
import { InfoBlock } from '@/shared/ui/InfoBlock'
import { Button } from '@/shared/ui/Button'
import serverErrorIcon from '@/shared/assets/icons/server-error.svg'

import styles from './ServerErrorPage.module.css'

export function ServerErrorPage() {
  return (
    <div className={styles.container}>
      <InfoBlock
        src={serverErrorIcon}
        alt="Иллюстрация ошибки 500"
        title="На сервере произошла ошибка"
        description="Попробуйте позже или вернитесь на главную страницу"
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

// Добавляем дефолтный экспорт для lazy-загрузки React!
export default ServerErrorPage
