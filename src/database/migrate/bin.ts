import 'dotenv/config'
import * as path from 'path'
import * as fs from 'fs/promises'
import SQLite, { type Database} from 'better-sqlite3'
import { FileMigrationProvider, Kysely, SqliteDialect } from 'kysely'
import { migrateToLatest } from '.'

const MIGRATION_PATH='../migrations'

async function migrateDefault(url: string) {
    const db = new Kysely<Database>({
        dialect: new SqliteDialect({
            database: new SQLite(url)
        })
    })

    const nodeProvider = new FileMigrationProvider({ fs, path, migrationFolder: path.join(__dirname, MIGRATION_PATH)})

    const { error, results } = await migrateToLatest(nodeProvider, db)

    results?.forEach((it) => {
        if (it.status === 'Success') {
          console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
          console.error(`failed to execute migration "${it.migrationName}"`)
        }
      })

     if(error) {
        console.log('failed to migrate')
        console.log(error)
        process.exit(1)
     }
     await db.destroy()
}

if (require.main === module) {
    const {DATABASE_URL} = process.env
    console.log(MIGRATION_PATH)

    if (typeof DATABASE_URL !== 'string') {
        throw new Error('Provide DATABASE_URL in your environment variables')
    }
    migrateDefault(DATABASE_URL)
}