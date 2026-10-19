import type { RootState } from '@/store'

export type RegistrationStep = 'credentials' | 'profile' | 'skill'

type RegistrationState = RootState['registration']

const STEP_ROUTES: Record<RegistrationStep, string> = {
  credentials: '/register/credentials',
  profile: '/register/profile',
  skill: '/register/skill',
}

export function getRegistrationStepRoute(step: RegistrationStep): string {
  return STEP_ROUTES[step]
}

export function isCredentialsFilled(registration: RegistrationState): boolean {
  return Boolean(registration.credentials.email.trim() && registration.credentials.password)
}

export function isProfileFilled(registration: RegistrationState): boolean {
  return Boolean(
    registration.profile.name.trim() &&
    registration.profile.birthDate &&
    registration.profile.gender &&
    registration.profile.cityId,
  )
}

export function isSkillFilled(registration: RegistrationState): boolean {
  return Boolean(
    registration.skill.title.trim() &&
    registration.skill.categoryId &&
    registration.skill.subcategoryId,
  )
}

export function isRegistrationStepFilled(
  registration: RegistrationState,
  step: RegistrationStep,
): boolean {
  switch (step) {
    case 'credentials':
      return isCredentialsFilled(registration)
    case 'profile':
      return isProfileFilled(registration)
    case 'skill':
      return isSkillFilled(registration)
  }
}

export function findFirstMissingRegistrationStep(
  registration: RegistrationState,
  requiredSteps: RegistrationStep[],
): RegistrationStep | null {
  for (const step of requiredSteps) {
    if (!isRegistrationStepFilled(registration, step)) {
      return step
    }
  }

  return null
}
