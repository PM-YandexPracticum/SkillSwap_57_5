// Описывает адреса API и читает моки для ответов на запросы

import { readFile } from 'node:fs/promises'
import { Router } from 'express'

// 1. Создаём группу маршрутов, app.ts подключает её по адресу /api
export const apiRouter = Router()

// 2. Читаем указанный файл моков и превращаем JSON в данные
async function readMockFile(fileName: string) {
  const filePath = new URL(`../data/${fileName}`, import.meta.url)
  const content = await readFile(filePath, 'utf8')

  return JSON.parse(content)
}

// 3. Обрабатываем GET /api/... запросы

// Отвечаем, что сервер работает
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Возвращаем моковые пользователей
apiRouter.get('/users', async (_req, res) => {
  res.json(await readMockFile('users.json'))
})

// Возвращаем моковые навыки
apiRouter.get('/skills', async (_req, res) => {
  res.json(await readMockFile('skills.json'))
})

// Возвращаем моковые города
apiRouter.get('/cities', async (_req, res) => {
  res.json(await readMockFile('cities.json'))
})

// Возвращаем моковые категории
apiRouter.get('/categories', async (_req, res) => {
  res.json(await readMockFile('categories.json'))
})
