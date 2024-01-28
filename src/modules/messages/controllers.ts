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
        const { id: randomTemplateId } = await templates.findRandomId()
        body.templateId = randomTemplateId
        body.url = await fetchGif()
        //@ts-ignore0
        await messages.createAccomplishment(body)
        const studentId = schema.parseId(body.studentId)
        const records = await messages.getInformationForPosting(studentId)

        // @ts-ignore
        const channel = await createChannel(bot, DISCORD_CHANNEL_ID)
        // @ts-ignore
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

      if (req.query.username === 'string') {
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
