import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'skillswap-images'
const DB_VERSION = 1
const STORE_NAME = 'images'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      },
    })
  }
  return dbPromise
}

export async function saveImage(key: string, file: File): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, file, key)
}

export async function getImage(key: string): Promise<File | undefined> {
  const db = await getDB()
  return db.get(STORE_NAME, key)
}

export async function deleteImage(key: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE_NAME, key)
}