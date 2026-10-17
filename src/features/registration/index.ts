export { useRegistrationCredentials } from './model/useRegistrationCredentials'
export { useRegistrationProfile } from './model/useRegistrationProfile'
export type {
  RegistrationProfileValues,
  RegistrationProfileErrors,
} from './model/useRegistrationProfile'
export { useRegistrationPreview } from './model/useRegistrationPreview'

export { useRegistrationSkill } from './model/useRegistrationSkill'
export type { RegistrationSkillValues, RegistrationSkillErrors } from './model/useRegistrationSkill'
export { useCompleteRegistration } from './model/useCompleteRegistration'

export type { RegistrationStep } from './lib/registrationSteps'
export {
  findFirstMissingRegistrationStep,
  getRegistrationStepRoute,
  isCredentialsFilled,
  isProfileFilled,
  isRegistrationStepFilled,
  isSkillFilled,
} from './lib/registrationSteps'
export { useRegistrationGuard } from './lib/useRegistrationGuard'

export { setRegistrationSource, clearRegistrationSource } from '@/store/slices/registrationSlice'
export type { RegistrationSource } from '@/store/slices/registrationSlice'