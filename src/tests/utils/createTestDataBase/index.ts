import { CamelCasePlugin, Kysely, SqliteDialect } from "kysely";
import SQLite from 'better-sqlite3'
import { migrateToLatest } from "@/database/migrate";
import { type DB } from '@/database'
import ModuleMigrationProvider from './moduleMigrationProvider'

const DATABASE_FILE = ':memory:'
export default async () => {
const provider = new ModuleMigrationProvider()
const database = new Kysely<DB>({
    dialect: new SqliteDialect({ database: new SQLite(DATABASE_FILE)}),
    plugins: [new CamelCasePlugin]
})
const { results, error} = await migrateToLatest(provider, database)
results?.filter((result) => result.status === 'Error')
.forEach((result) => {
    console.error(`failed to execute migration "${result.migrationName}"`)
})
if (error) {
    console.log('failed to migrate')
    console.log(error)
}
return database
}
