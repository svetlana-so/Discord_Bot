import { Router } from 'express'
import { type Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRepository from './repository'
import * as schema from './schema'
import MethodNotAllowed from '@/utils/errors/MethodNotAllowed'
import { StatusCodes } from 'http-status-codes'

export default (db: Database) => {
  const sprints = buildRepository(db)
  const router = Router()

  router.get(
    '/',
    jsonRoute(async () => {
      const sprintsList = await sprints.findAll()
      return sprintsList
    })
  )
  router.get(
    '/:id(\\d+)',
    jsonRoute(async (req) => {
      const id = schema.parseId(req.params.id)
      const record = await sprints.findById(id)
      if (!record) {
        throw new MethodNotAllowed()
      }
      return record
    })
  )
  router.post(
    '/',
    jsonRoute(async (req) => {
      const body = schema.parseInsertable(req.body)
      return sprints.addSprint(body)
    }, StatusCodes.CREATED)
  )
  router.patch(
    '/:id(\\d+)',
    jsonRoute(async (req) => {
      const id = schema.parseId(req.params.id)
      const bodyPatch = schema.perseUpdatable(req.body)
      const record = await sprints.update(id, bodyPatch)

      if (!record) {
        throw new MethodNotAllowed()
      }
      return record
    })
  )
  return router
}
