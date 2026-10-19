import { describe, expect, it } from 'vitest'

import notificationsReducer, {
  addNotification,
  addProposedExchange,
  clearReadNotifications,
  markAllAsRead,
  markAsRead,
  setNotifications,
  type ExchangeNotification,
  type NotificationsState,
} from './notificationsSlice'

const createNotification = (
  id: string,
  recipientUserId: string,
  isRead = false,
): ExchangeNotification => ({
  id,
  recipientUserId,
  skillId: 'skill-1',
  text: 'Обмен предложен',
  createdAt: '2026-10-19T12:00:00.000Z',
  isRead,
})

const createState = (): NotificationsState => ({
  items: [
    createNotification('n1', 'user-1'),
    createNotification('n2', 'user-1', true),
    createNotification('n3', 'user-1'),
    createNotification('n4', 'user-2'),
    createNotification('n5', 'user-2', true),
  ],
  proposedExchanges: [{ userId: 'user-1', skillId: 'skill-1' }],
})

describe('notificationsSlice', () => {
  it('возвращает начальное состояние при undefined', () => {
    expect(notificationsReducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      proposedExchanges: [],
    })
  })

  it('сохраняет состояние при неизвестном действии', () => {
    const state = createState()
    expect(notificationsReducer(state, { type: 'unknown' })).toBe(state)
  })

  it('добавляет уведомление, сохраняя существующие уведомления и обмены', () => {
    const state = createState()
    const notification = createNotification('n6', 'user-2')

    expect(notificationsReducer(state, addNotification(notification))).toEqual({
      ...state,
      items: [...state.items, notification],
    })
  })

  describe('addProposedExchange', () => {
    it.each([
      { userId: 'user-2', skillId: 'skill-2' },
      { userId: 'user-1', skillId: 'skill-2' },
      { userId: 'user-2', skillId: 'skill-1' },
    ])('добавляет новую пару пользователя и навыка: %j', (exchange) => {
      const state = createState()

      expect(notificationsReducer(state, addProposedExchange(exchange))).toEqual({
        ...state,
        proposedExchanges: [...state.proposedExchanges, exchange],
      })
    })

    it('не добавляет повторно ту же пару пользователя и навыка', () => {
      const state = createState()
      const exchange = { userId: 'user-1', skillId: 'skill-1' }

      expect(notificationsReducer(state, addProposedExchange(exchange))).toEqual(state)
    })
  })

  describe('markAsRead', () => {
    it('отмечает прочитанным только указанное уведомление', () => {
      const state = createState()

      expect(notificationsReducer(state, markAsRead('n1'))).toEqual({
        ...state,
        items: [{ ...state.items[0], isRead: true }, ...state.items.slice(1)],
      })
    })

    it.each(['missing', 'n2'])('не меняет состояние для уведомления %s', (id) => {
      const state = createState()
      expect(notificationsReducer(state, markAsRead(id))).toEqual(state)
    })
  })

  describe('markAllAsRead', () => {
    it('отмечает все уведомления пользователя, сохраняя уведомления другого', () => {
      const state = createState()

      expect(notificationsReducer(state, markAllAsRead('user-1'))).toEqual({
        ...state,
        items: [
          createNotification('n1', 'user-1', true),
          createNotification('n2', 'user-1', true),
          createNotification('n3', 'user-1', true),
          createNotification('n4', 'user-2'),
          createNotification('n5', 'user-2', true),
        ],
      })
    })

    it('сохраняет состояние, если у пользователя нет уведомлений', () => {
      const state = createState()
      expect(notificationsReducer(state, markAllAsRead('missing'))).toEqual(state)
    })
  })

  describe('clearReadNotifications', () => {
    it('удаляет только прочитанные уведомления пользователя, сохраняя обмены', () => {
      const state = createState()

      expect(notificationsReducer(state, clearReadNotifications('user-1'))).toEqual({
        items: [state.items[0], state.items[2], state.items[3], state.items[4]],
        proposedExchanges: state.proposedExchanges,
      })
    })

    it('сохраняет состояние, если у пользователя нет уведомлений', () => {
      const state = createState()
      expect(notificationsReducer(state, clearReadNotifications('missing'))).toEqual(state)
    })

    it('после прочтения всех уведомлений удаляет их, сохраняя чужие и обмены', () => {
      const state = createState()
      const readState = notificationsReducer(state, markAllAsRead('user-1'))

      expect(notificationsReducer(readState, clearReadNotifications('user-1'))).toEqual({
        items: [state.items[3], state.items[4]],
        proposedExchanges: state.proposedExchanges,
      })
    })
  })

  describe('setNotifications', () => {
    it('восстанавливает уведомления и обмены в пустое состояние', () => {
      const restoredState = createState()

      expect(notificationsReducer(undefined, setNotifications(restoredState))).toEqual(restoredState)
    })

    it('заменяет существующие уведомления и обмены восстановленными', () => {
      const restoredState: NotificationsState = {
        items: [createNotification('restored', 'user-3', true)],
        proposedExchanges: [{ userId: 'user-3', skillId: 'skill-3' }],
      }

      expect(notificationsReducer(createState(), setNotifications(restoredState))).toEqual(
        restoredState,
      )
    })

    it('позволяет восстановить пустое состояние поверх заполненного', () => {
      const emptyState: NotificationsState = { items: [], proposedExchanges: [] }

      expect(notificationsReducer(createState(), setNotifications(emptyState))).toEqual(emptyState)
    })
  })
})
