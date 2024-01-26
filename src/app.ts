import express from 'express'
import jsonErrorHandler from './middleware/jsonErrors'
import { type Database } from './database'
import sprints from '@/modules/sprints/controllers'
import templates from '@/modules/templates_messages/controllers'
import students from '@/modules/students/controllers'
import messages from '@/modules/messages/controllers'
import { Client } from 'discord.js'

export default function createApp(db: Database, bot?: Client) {
  const app = express()
  app.use(express.json())
 

  app.use('/sprints', sprints(db))
  app.use('/templates', templates(db))
  app.use('/students', students(db))
  app.use('/messages', bot? messages(db, bot): messages(db))
  app.use(jsonErrorHandler)
  return app
}
