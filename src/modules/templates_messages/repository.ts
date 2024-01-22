import { Insertable, Updateable, Selectable } from 'kysely'
import { Database, Templates } from '@/database'
import { keys } from './schema'

const TABLE = 'templates'
type Row = Templates
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  findAll: async () => db.selectFrom(TABLE).selectAll().execute(),
  findById: async (id: number) =>
    db.selectFrom(TABLE).select(keys).where('id', '=', id).execute(),
  addMessage: async (record: RowInsert) =>
    db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst(),

  update: async (
    id: number,
    partial: RowUpdate
  ): Promise<RowSelect | undefined> => {
    if (Object.keys(partial).length === 0) {
      // @ts-ignore
      return this.findById(id)
    }
    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },
})
