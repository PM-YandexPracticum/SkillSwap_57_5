import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface ExchangeNotification {
  // Уникальный ID уведомления
  id: string
  // Получатель уведомления, тот кто сам предложил обмен
  recipientUserId: string
  // id навыка, который откроется по кнопке «Перейти»
  skillId: string
  text: string
  createdAt: string
  isRead: boolean
}

// Кто и какому навыку уже предложил обмен. Нужен для состояния кнопки
export interface ProposedExchange {
  userId: string
  skillId: string
}

export interface NotificationsState {
  // Сообщения под колокольчиком и красная точка для непрочитанных
  items: ExchangeNotification[]
  // Для кнопки «Обмен предложен». сохраняется при очистке уведомлений
  proposedExchanges: ProposedExchange[]
}

const initialState: NotificationsState = {
  items: [],
  proposedExchanges: [],
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Запоминает, что пользователь уже предложил обмен этому навыку
    addProposedExchange(state, action: PayloadAction<ProposedExchange>) {
      const alreadyProposed = state.proposedExchanges.some(
        (exchange) =>
          exchange.userId === action.payload.userId && exchange.skillId === action.payload.skillId,
      )

      if (!alreadyProposed) {
        state.proposedExchanges.push(action.payload)
      }
    },
    // Добавляет уведомление, собранное в обработчике кнопки
    addNotification(state, action: PayloadAction<ExchangeNotification>) {
      state.items.push(action.payload)
    },

    // Получает id уведомления и отмечает только его прочитанным
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find((item) => item.id === action.payload)

      if (notification) {
        notification.isRead = true
      }
    },
    // Получает id пользователя и отмечает все его уведомления прочитанными
    markAllAsRead(state, action: PayloadAction<string>) {
      state.items.forEach((notification) => {
        if (notification.recipientUserId === action.payload) {
          notification.isRead = true
        }
      })
    },
    // Получает id пользователя и удаляет его прочитанные уведомления
    clearReadNotifications(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (notification) => notification.recipientUserId !== action.payload || !notification.isRead,
      )
    },

    // Записывает восстановленные уведомления и предложенные обмены в Redux
    setNotifications(state, action: PayloadAction<NotificationsState>) {
      state.items = action.payload.items
      state.proposedExchanges = action.payload.proposedExchanges
    },
  },
})

export const {
  setNotifications,
  addProposedExchange,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearReadNotifications,
} = notificationsSlice.actions

export default notificationsSlice.reducer
