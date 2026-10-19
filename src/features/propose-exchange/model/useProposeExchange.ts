import type { Skill } from '@/entities/skill'
import { saveNotifications } from '@/features/notifications'
import { generateId } from '@/shared/lib/helpers'

import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addProposedExchange, addNotification } from '@/store/slices/notificationsSlice'

export const useProposeExchange = (skill: Skill | undefined) => {
  const dispatch = useAppDispatch()

  const currentUserId = useAppSelector((state) => state.users.currentUserId)

  const proposedExchanges = useAppSelector((state) => state.notifications.proposedExchanges)

  const isAlreadyProposed = proposedExchanges.some(
    (exchange) => exchange.userId === currentUserId && exchange.skillId === skill?.id,
  )

  const canProposeExchange =
    Boolean(currentUserId) &&
    Boolean(skill) &&
    currentUserId !== skill?.authorId &&
    !isAlreadyProposed

  const proposeExchange = () => {
    if (!currentUserId || !skill || !canProposeExchange) return

    dispatch(
      addProposedExchange({
        userId: currentUserId,
        skillId: skill.id,
      }),
    )

    dispatch(
      addNotification({
        id: generateId(),
        recipientUserId: currentUserId,
        skillId: skill.id,
        text: `Вы предложили обмен навыком '${skill.title}'`,
        createdAt: new Date().toISOString(),
        isRead: false,
      }),
    )

    // Сохраняем в localStorage обновлённые уведомления и предложенные обмены из Redux
    saveNotifications(store.getState().notifications)
  }
  return { proposeExchange, canProposeExchange, isAlreadyProposed }
}
