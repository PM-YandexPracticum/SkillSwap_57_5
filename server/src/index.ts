// Читает настройки адреса и порта, запускает сервер и сообщает об ошибках запуска

import { config } from 'dotenv'
import { app } from './app.js'

// 1. Читаем настройки из .env, quiet отключает сообщения самой библиотеки dotenv
config({ path: '.env', quiet: true })

// 2. Берём адрес и порт из настроек
const host = process.env.HOST || '127.0.0.1'
const port = Number(process.env.PORT || 3001)

// 3. Проверяем порт до запуска: допустимы только целые числа от 1 до 65535
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT должен быть целым числом от 1 до 65535')
}

// 4. Начинаем принимать запросы и выводим адрес сервера
const server = app.listen(port, host, () => {
  console.log(`Сервер запущен: http://${host}:${port}`)
})

// 5. Сообщаем об ошибке запуска, например о занятом порте. Код завершения 1 означает ошибку.
server.on('error', (error: NodeJS.ErrnoException) => {
  console.error(`Не удалось запустить API: ${error.code || 'UNKNOWN_ERROR'}`)
  process.exitCode = 1
})
