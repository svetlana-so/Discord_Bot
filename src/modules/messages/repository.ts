import type { Insertable } from 'kysely'
import type { Database, Messages } from '@/database'
import { keys } from './schema'

type Row = Messages
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>

const TABLE = 'messages'
export default (db: Database) => ({
  createAccomplishment: async (record: RowInsert & { url: string }) => {
    await db.transaction().execute(async (trx) => {
      await trx
        .insertInto(TABLE)
        .values(record)
        .returning(keys)
        .executeTakeFirstOrThrow()
    })
  },

  getInformationForPosting: async (id: number) =>
    db
      .selectFrom(TABLE)
      .innerJoin('students', 'studentId', 'students.id')
      .innerJoin('templates', 'templateId', 'templates.id')
      .innerJoin('sprints', 'sprintId', 'sprints.id')
      .select([
        'messages.url',
        'students.username',
        'sprints.title',
        'templates.text',
      ])
      .where('studentId', '=', id)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .execute(),

  getAListOfAllCongratulatoryMessages: async () =>
    db
      .selectFrom(TABLE)
      .innerJoin('students', 'studentId', 'students.id')
      .innerJoin('templates', 'templateId', 'templates.id')
      .innerJoin('sprints', 'sprintId', 'sprints.id')
      .select([
        'students.username',
        'students.name',
        'sprints.title',
        'templates.text',
        'messages.url',
      ])
      .execute(),

  getAListOfAllCongratulatoryMessagesForASpecificUser: async (
    username: string
  ) =>
    db
      .selectFrom(TABLE)
      .innerJoin('students', 'studentId', 'students.id')
      .innerJoin('templates', 'templateId', 'templates.id')
      .innerJoin('sprints', 'sprintId', 'sprints.id')
      .select([
        'students.name',
        'sprints.title',
        'templates.text',
        'messages.url',
       /*  'students.username' */
      ])
      .where('students.username', '=', username)
      .execute(),

  getAListOfAllCongratulatoryMessagesForASpecificSprint: async (
    sprint: string
  ) =>
    db
      .selectFrom(TABLE)
      .innerJoin('students', 'studentId', 'students.id')
      .innerJoin('templates', 'templateId', 'templates.id')
      .innerJoin('sprints', 'sprintId', 'sprints.id')
      .select([
        'students.name',
        'sprints.title',
        'sprints.sprintCode',
        'templates.text',
        'messages.url',
      ])
      .where('sprints.sprintCode', '=', sprint)
      .execute(),
})
