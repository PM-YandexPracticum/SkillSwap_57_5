// Создаёт Express-приложение, задаёт общие настройки и подключает маршруты и ошибки

import { fileURLToPath } from 'node:url'
import express from 'express'
import { apiRouter } from './routes.js'
import { errorHandler, notFoundHandler } from './errors.js'

// 1. Создаём Express-приложение
export const app = express()

app.disable('x-powered-by')

// 2. Разрешаем браузеру читать ответы API со страницы фронтенда
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  next()
})

// 3. Разбираем JSON из тела запроса и ограничиваем его размер до 100 КБ
app.use(express.json({ limit: '100kb' }))

// 4. Отдаём фотографии из server/images по адресам /images/...
const imagesDirectory = fileURLToPath(new URL('../images/', import.meta.url))
app.use('/images', express.static(imagesDirectory))

// 5. Подключаем группу маршрутов API
app.use('/api', apiRouter)

// 6. Отвечаем, если адрес не найден
app.use(notFoundHandler)

// 7. Обрабатываем ошибки после маршрутов
app.use(errorHandler)
