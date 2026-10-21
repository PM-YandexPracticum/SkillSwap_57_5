// Создаёт Express-приложение и описывает обработку запросов и ответы, включая ошибки

import express, { type NextFunction, type Request, type Response } from 'express'

// 1. Создаём Express-приложение, в котором будем описывать обработку запросов
export const app = express()

app.disable('x-powered-by')

// 3. Разбираем JSON из тела запроса и ограничиваем его размер до 100 КБ
app.use(express.json({ limit: '100kb' }))

// 4. Принимаем GET /api/health и отвечаем, что сервер работает
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// 5. Возвращаем 404, если ни один из описанных выше адресов не подошёл
app.use((_req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Такого адреса API нет' },
  })
})

// 6. Обрабатываем ошибки после маршрутов. Express узнаёт этот обработчик по четырём аргументам.
// Аргумент _next сохраняем, хотя внутри функции он не используется.
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Error && 'type' in error) {
    // 6.1. Возвращаем 400, если тело запроса не удалось разобрать как JSON
    if (error.type === 'entity.parse.failed') {
      res.status(400).json({
        error: { code: 'INVALID_JSON', message: 'Некорректный JSON в запросе' },
      })
      return
    }

    // 6.2. Возвращаем 413, если JSON превышает установленный лимит
    if (error.type === 'entity.too.large') {
      res.status(413).json({
        error: { code: 'PAYLOAD_TOO_LARGE', message: 'Запрос превышает 100 КБ' },
      })
      return
    }
  }

  // 6.3. Для неожиданной ошибки записываем только её тип и возвращаем 500
  // Тело запроса и подробности ошибки могут содержать секреты, поэтому их не выводим
  console.error('Unhandled server error:', error instanceof Error ? error.name : 'UnknownError')
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Внутренняя ошибка сервера' },
  })
})
