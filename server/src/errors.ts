// Отвечает на неизвестные адреса и обрабатывает ошибки запросов

import type { NextFunction, Request, Response } from 'express'

// 1. Возвращаем 404, если ни один из маршрутов не подошёл
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Такого адреса API нет' },
  })
}

// 2. Express узнаёт обработчик ошибок по четырём аргументам.
// Аргумент _next сохраняем, хотя внутри функции он не используется.
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof Error && 'type' in error) {
    // 2.1. Возвращаем 400, если тело запроса не удалось разобрать как JSON
    if (error.type === 'entity.parse.failed') {
      res.status(400).json({
        error: { code: 'INVALID_JSON', message: 'Некорректный JSON в запросе' },
      })
      return
    }

    // 2.2. Возвращаем 413, если JSON превышает установленный лимит
    if (error.type === 'entity.too.large') {
      res.status(413).json({
        error: { code: 'PAYLOAD_TOO_LARGE', message: 'Запрос превышает 100 КБ' },
      })
      return
    }
  }

  // 2.3. Для неожиданной ошибки записываем только её тип и возвращаем 500
  // Тело запроса и подробности ошибки могут содержать секреты, поэтому их не выводим
  console.error('Unhandled server error:', error instanceof Error ? error.name : 'UnknownError')
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Внутренняя ошибка сервера' },
  })
}
