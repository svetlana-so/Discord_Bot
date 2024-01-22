import supertest from 'supertest'
import createTestDataBase from '@/tests/utils/createTestDataBase'
import createApp from '@/app'
import { omit } from 'lodash/fp'
import { studentsFactory, studentsMatcher } from './utuls'

const db = await createTestDataBase()
const { DISCORD_BOT_ID } = process.env

if (!DISCORD_BOT_ID) {
  throw new Error('Provide DISCORD_BOT_TOKEN in your environment variables')
}

const app = createApp(db, DISCORD_BOT_ID)

afterAll(() => db.destroy())
afterEach(async () => {
  await db.deleteFrom('students').execute()
})

describe('POST', () => {
  it('returns 400 if username is missing', async () => {
    const { body } = await supertest(app)
      .post('/students')
      .send(omit(['username'], studentsFactory({})))
      .expect(400)

    expect(body.error.message).toMatch(/username/i)
  })
  it('returns 400 if name is missing', async () => {
    const { body } = await supertest(app)
      .post('/students')
      .send(omit(['name'], studentsFactory({})))
      .expect(400)

    expect(body.error.message).toMatch(/name/i)
  })
  it('should return 201 and create a student', async () => {
    const { body } = await supertest(app)
      .post('/students')
      .send(studentsFactory())
      .expect(200)

    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThanOrEqual(1)

    expect(body[0]).toHaveProperty('id')
    expect(body[0]).toHaveProperty('name', 'My Name')
    expect(body[0]).toHaveProperty('username', 'username')
  })
})
