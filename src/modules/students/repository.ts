import type { Database, Students } from '@/database'
import { keys } from './schema'
import { Insertable } from 'kysely'

const TABLE = 'students'
type Row = Students
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
export default (db: Database) => ({
  addStudent: async (record: RowInsert) =>
    db.insertInto(TABLE).values(record).returning(keys).execute(),
})
