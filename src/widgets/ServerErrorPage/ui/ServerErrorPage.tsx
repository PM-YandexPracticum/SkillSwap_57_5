import { useNavigate } from 'react-router-dom'
import { InfoBlock } from '@/shared/ui/InfoBlock'
import { Button } from '@/shared/ui/Button'
import serverErrorIcon from '@/shared/assets/icons/server-error.svg'

import styles from './ServerErrorPage.module.css'

export function ServerErrorPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <InfoBlock
        variant="error"
        src={serverErrorIcon}
        alt="Иллюстрация ошибки 500"
        title="На сервере произошла ошибка"
        description="Попробуйте позже или вернитесь на главную страницу"
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

export default ServerErrorPage
