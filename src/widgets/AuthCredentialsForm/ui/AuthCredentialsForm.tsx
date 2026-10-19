import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { InfoBlock } from '@/shared/ui/InfoBlock'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { InputWithAction } from '@/shared/ui/InputWithAction'
import { FormField } from '@/shared/ui/FormField'
import { passwordSchema } from '@/shared/lib/passwordValidation'

import LightBulb from '@/shared/assets/icons/light-bulb.svg'
import AppleIcon from '@/shared/assets/icons/Apple.svg'
import GoogleIcon from '@/shared/assets/icons/Google.svg'
import EyeIcon from '@/shared/assets/icons/eye.svg'
import EyeOffIcon from '@/shared/assets/icons/eye-off.svg'

import styles from './AuthCredentialsForm.module.css'

interface AuthCredentialsFormProps {
  variant: 'login' | 'registration'
  onSubmit: (data: { email: string; password: string }) => void
  savedValues?: { email: string; password: string }
  errors?: { email?: string; password?: string }
}

export function AuthCredentialsForm({
  variant,
  onSubmit,
  savedValues,
  errors,
}: AuthCredentialsFormProps) {
  const [email, setEmail] = useState(savedValues?.email || '')
  const [password, setPassword] = useState(savedValues?.password || '')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (savedValues) {
      setEmail(savedValues.email)
      setPassword(savedValues.password)
    }
  }, [savedValues])

  const isPasswordValid = passwordSchema.isValidSync(password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <section className={clsx(styles.container, variant === 'login' && styles.login)}>
      <div className={styles.contentContainer}>
        <div className={styles.serviceButtonWrapper}>
          <Button className={styles.serviceButton} variant={'secondary'}>
            <img alt="" aria-hidden="true" src={GoogleIcon} className={styles.buttonIcon} />
            Продолжить с Google
          </Button>
          <Button className={styles.serviceButton} variant={'secondary'}>
            <img alt="" aria-hidden="true" src={AppleIcon} className={styles.buttonIcon} />
            Продолжить с Apple
          </Button>
        </div>

        <div className={styles.separator}>
          <p>или</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
          noValidate={variant === 'registration'}
        >
          <div>
            <FormField id="email" label={'Email'}>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Введите email"
                autoComplete="email"
                aria-invalid={Boolean(errors?.email || (variant === 'login' && errors?.password))}
                aria-describedby={
                  errors?.email
                    ? 'auth-email-error'
                    : variant === 'login' && errors?.password
                      ? 'auth-password-error'
                      : undefined
                }
                className={
                  errors?.email || (variant === 'login' && errors?.password)
                    ? styles.inputError
                    : undefined
                }
              />
            </FormField>
            {errors?.email && (
              <p id="auth-email-error" className={styles.errorHint} role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <InputWithAction
              id="password"
              label="Пароль"
              actionIconSrc={showPassword ? EyeOffIcon : EyeIcon}
              actionLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              onAction={() => setShowPassword(!showPassword)}
              showAction={true}
            >
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                autoComplete={variant === 'login' ? 'current-password' : 'new-password'}
                aria-invalid={Boolean(errors?.password)}
                aria-describedby={
                  errors?.password
                    ? 'auth-password-error'
                    : variant === 'registration'
                      ? 'auth-password-hint'
                      : undefined
                }
                className={errors?.password ? styles.inputError : undefined}
                placeholder={
                  variant === 'registration' ? 'Придумайте надёжный пароль' : 'Введите пароль'
                }
              />
            </InputWithAction>
            {errors?.password && (
              <p id="auth-password-error" className={styles.errorHint} role="alert">
                {errors.password}
              </p>
            )}

            {variant === 'registration' && !errors?.password && (
              <p id="auth-password-hint" className={styles.hint}>
                {isPasswordValid
                  ? 'Надёжный пароль'
                  : 'Минимум 8 символов, строчные и заглавные латинские буквы, цифры и спецсимволы'}
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
          src={LightBulb}
          title={'Добро пожаловать в SkillSwap!'}
          description={
            'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми'
          }
        />
      </div>
    </section>
  )
}
