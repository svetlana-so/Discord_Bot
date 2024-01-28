import 'dotenv/config'
import createApp from './app'
import createDatabase from './database'
import createBot from './bot'

const { DATABASE_URL, DISCORD_BOT_ID } = process.env

const PORT = 3002

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables')
}
if (!DISCORD_BOT_ID) {
  throw new Error('Provide DISCORD_BOT_TOKEN in your environment variables')
}

const database = createDatabase(DATABASE_URL)
const bot = createBot(DISCORD_BOT_ID)
const app = createApp(database, bot)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
