import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('sprints')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('sprint_code', 'text', (c) => c.notNull().unique())
    .addColumn('title', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('students')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('name', 'text', (c) => c.notNull())
    .addColumn('username', 'text', (c) => c.unique().notNull())
    .execute()

  await db.schema
    .createTable('templates')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('text', 'text', (c) => c.notNull().unique())
    .execute()
}
