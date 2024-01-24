import { type Database } from '../database'

export const getRandomTemplateId = async (db: Database) => {
  const existingIds = await db.selectFrom('templates').select('id').execute()

  const randomIndex = Math.floor(Math.random() * existingIds.length)
  return existingIds[randomIndex].id
}
