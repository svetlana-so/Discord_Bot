import { Router } from 'express'
import type { Database } from '@/database'
import { StatusCodes } from 'http-status-codes'
import { jsonRoute } from '@/utils/middleware'
import buildRepository from './repository'
import * as schema from './schema'
import MethodNotAllowed from '@/utils/errors/MethodNotAllowed'

export default (db: Database) => {
  const templates = buildRepository(db)
  const router = Router()

  router.get(
    '/',
    jsonRoute(async () => {
      const templatesList = await templates.findAll()
      return templatesList
    }, StatusCodes.CREATED)
  )
  router.get(
    '/:id(\\d+)',
    jsonRoute(async (req) => {
      const id = schema.parseId(req.params.id)
      const record = await templates.findById(id)
      if (record.length === 0) {
        throw new MethodNotAllowed()
      }
      return record
    })
  )
  router.post(
    '/',
    jsonRoute(async (req) => {
      const body = schema.parseInsertable(req.body)
      return templates.addMessage(body)
    }, StatusCodes.CREATED)
  )
  router.patch(
    '/:id(\\d+)',
    jsonRoute(async (req) => {
      const id = schema.parseId(req.params.id)
      const bodyPatch = schema.perseUpdatable(req.body)
      const record = await templates.update(id, bodyPatch)

      if (!record) {
        throw new MethodNotAllowed()
      }
      return record
    })
  )
  return router
}
