import { useState } from 'react'
import { Link } from 'react-router-dom'

import { InfoBlock } from '@/shared/ui/InfoBlock'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { InputWithAction } from '@/shared/ui/InputWithAction'
import { FormField } from '@/shared/ui/FormField'

import lightBulb from '@/shared/assets/icons/light-bulb.svg'
import appleIcon from '@/shared/assets/icons/Apple.svg'
import googleIcon from '@/shared/assets/icons/Google.svg'
import eyeIcon from '@/shared/assets/icons/eye.svg'

import styles from './CredentialsForm.module.css'

interface CredentialsFormProps {
  variant: 'login' | 'registration'
  onSubmit: (data: { email: string; password: string }) => void
}

export function CredentialsForm({
  variant,
  onSubmit,
}: CredentialsFormProps) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordValid = password.length >= 8

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <section className={styles.container}>
      <div className={styles.contentContainer}>
        
        <div className={styles.serviceButtonWrapper}>
          <Button className={styles.serviceButton} variant={'secondary'}>
            <img alt="" aria-hidden="true" src={googleIcon} className={styles.buttonIcon} />
            Продолжить с Google
          </Button>
          <Button className={styles.serviceButton} variant={'secondary'}>
            <img alt="" aria-hidden="true" src={appleIcon} className={styles.buttonIcon} />
            Продолжить с Apple
          </Button>
        </div>

        <div className={styles.separator}>
          <p>или</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <FormField id="email" label={'Email'}>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Введите email"
            />
          </FormField>

          <div>
            <InputWithAction
              id="password"
              label="Пароль"
              actionIconSrc={eyeIcon}         // ← иконка глаза
              actionLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              onAction={() => setShowPassword(!showPassword)}
              showAction={true}
            >
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                placeholder={
                  variant === 'registration'
                    ? 'Придумайте надёжный пароль'
                    : 'Введите пароль'
                }
              />
            </InputWithAction>

            {variant === 'registration' && (
              <p className={styles.hint}>
                {isPasswordValid
                  ? 'Надёжный пароль'
                  : 'Пароль должен содержать минимум 8 символов'}
              </p>
            )}
          </div>
          
          <Button type="submit" className={styles.submitButton}>
            {variant === 'registration' ? 'Далее' : 'Войти'}
          </Button>

        </form>
        
        {variant === 'registration' && (
          <Link to="/login" className={styles.link}>
            Уже есть аккаунт? Войти
          </Link>
        )}

      </div>
      <div className={styles.contentContainer}>
        <InfoBlock 
          src={lightBulb}
          title={'Добро пожаловать в SkillSwap!'}
          description={'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми'}
        />
      </div>
    </section>
  )

}