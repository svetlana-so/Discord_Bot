import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRepository from './repository'
import * as schema from './schema'

export default (db: Database) => {
  const students = buildRepository(db)
  const router = Router()

  router.get(
    '/',
    jsonRoute(async () => {
      const sprintsList = await students.findAll()
      return sprintsList
    })
  )

  router.post(
    '/',
    jsonRoute(async (req) => {
      const body = schema.parseInsertable(req.body)
      return students.addStudent(body)
    }, StatusCodes.CREATED)
  )
  return router
}
