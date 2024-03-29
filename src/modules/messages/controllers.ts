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
import fetchGif from '@/utils/fetchGif'
import buildTemplateRepositore from '../templates_messages/repository'

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID

export default (db: Database, bot?: Client) => {
  const router = Router()
  const messages = buildRepository(db)
  const templates = buildTemplateRepositore(db)

  router.post(
    '/',
    jsonRoute(async (req) => {
      try {
        const body = schema.parseInsertable(req.body)
        const randomId = await templates.findRandomId()
        if (!randomId) {
          throw new Error()
        }
        const { id: randomTemplateId } = randomId
        const url = await fetchGif()
        if (!url) {
          throw new Error()
        }

        const record = {
          ...body,
          templateId: randomTemplateId,
          url,
        }

        await messages.createAccomplishment(record)

        const studentId = schema.parseId(body.studentId)
        const records = await messages.getInformationForPosting(studentId)

        const channel = await createChannel(bot, DISCORD_CHANNEL_ID)

        await sendMessage(channel, records)

        return { message: 'Accomplishment created successfully.' }
      } catch (error) {
        console.log(error)
        return error
      }
    }, StatusCodes.CREATED)
  )

  router.get(
    '/',
    jsonRoute(async (req) => {
      const { username, sprint } = req.query

      if (typeof username === 'string') {
        return messages.getAListOfAllCongratulatoryMessagesForASpecificUser(
          username as string
        )
      }
      if (typeof sprint === 'string') {
        return await messages.getAListOfAllCongratulatoryMessagesForASpecificSprint(
          sprint as string
        )
      }

      const all_messages = await messages.getAListOfAllCongratulatoryMessages()
      return all_messages
    }, StatusCodes.OK)
  )
  router.route('/').patch(unsupportedRoute)
  router.route('/').delete(unsupportedRoute)
  return router
}
