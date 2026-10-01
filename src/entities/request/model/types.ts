import type { SkillId } from '@/entities/skill'
import type { UserId } from '@/entities/user'

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'inProgress'
  | 'done'

export interface SwapRequest {
  id: string
  skillId: SkillId
  fromUserId: UserId
  toUserId: UserId
  status: RequestStatus
  createdAt: string
  updatedAt: string
}
