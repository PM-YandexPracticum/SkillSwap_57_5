import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppSelector } from '@/store/hooks'

import {
  findFirstMissingRegistrationStep,
  getRegistrationStepRoute,
  type RegistrationStep,
} from './registrationSteps'

export function useRegistrationGuard(requiredSteps: RegistrationStep[]): void {
  const navigate = useNavigate()
  const registration = useAppSelector((state) => state.registration)

  const missingStep = findFirstMissingRegistrationStep(registration, requiredSteps)

  useEffect(() => {
    if (missingStep) {
      navigate(getRegistrationStepRoute(missingStep), { replace: true })
    }
  }, [missingStep, navigate])
}