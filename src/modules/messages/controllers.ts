import 'dotenv/config'
import { StatusCodes } from 'http-status-codes'
import { Router } from 'express'
import type { Database } from '@/database'
import { jsonRoute, unsupportedRoute } from '@/utils/middleware'
import buildRepository from './repository'
import { Client } from 'discord.js'
import { createChannel } from '@/utils/createChannel'
import sendMessage from '@/utils/sendEmded'
import * as schema from './schema'

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID

export default (db: Database, botClient: Client) => {
  const router = Router()
  const messages = buildRepository(db)

  router.post(
    '/',
    jsonRoute(async (req, res) => {
      const body = schema.parseInsertable(req.body)
      await messages.createAccomplishment(body)

      const studentId = schema.parseId(body.studentId)

      const records = await messages.getInformationForPosting(studentId)

      // @ts-ignore
      const channel = await createChannel(botClient, DISCORD_CHANNEL_ID)
      // @ts-ignore
      await sendMessage(channel, records)
    }, StatusCodes.CREATED)
  )

  router.get(
    '/',
    jsonRoute(async (req) => {
      const { username, sprint } = req.query

      if (typeof req.query.username === 'string') {
        return messages.getAListOfAllCongratulatoryMessagesForASpecificUser(
          username as string
        )
      }
      if (typeof req.query.sprint === 'string') {
        return await messages.getAListOfAllCongratulatoryMessagesForASpecificSprint(
          sprint as string
        )
      }

      const all_messages = await messages.getAListOfAllCongratulatoryMessages()
      return all_messages
    }, StatusCodes.OK)
  )
  router.route('/').patch(unsupportedRoute)
  return router
}
