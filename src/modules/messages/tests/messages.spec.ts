import supertest from 'supertest'
import createTestDataBase from '@/tests/utils/createTestDataBase'
import { createFor } from '@/tests/utils/records'
import * as fixtures from './fixtures'
import { Insertable } from 'kysely'
import createApp from '@/app'
import { Messages } from '@/database'

const db = await createTestDataBase()
const { DISCORD_BOT_ID } = process.env

if (!DISCORD_BOT_ID) {
  throw new Error('Provide DISCORD_BOT_TOKEN in your environment variables')
}

const app = createApp(db, DISCORD_BOT_ID)

const createSprints = createFor(db, 'sprints')
const createTemplates = createFor(db, 'templates')
const createSrudents = createFor(db, 'students')
const createMessages = createFor(db, 'messages')

await createSprints(fixtures.sprints)
await createTemplates(fixtures.templates)
await createSrudents(fixtures.students)

afterEach(async () => {
  await db.deleteFrom('messages').execute()
})

//make fake data

/* const messagesFactory = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => ({
  studentId: 1,
  sprintId: 1,
  templateId: 1,
  ...overrides,
})

const messagesMatcher = (overrides: Partial<Insertable<Messages>> = {}) => ({
  timestamp: expect.any(String),
  ...overrides,
  ...messagesFactory(),
}) */

describe('POST', () => {
  it('should post the message of accomplishment for a specific student', async () => {
    await supertest(app)
      .post('/messages')
      .send({ studentId: 1, sprintId: 1, templateId: 1 })
      .expect(201)
  })

  it('returns 500 if no user is found with a specific id', async () => {
    await supertest(app)
      .post('/messages')
      .send({ studentId: 3, sprintId: 1, templateId: 1 })
      .expect(500)
  })
})

describe('GET', () => {
  it('should return the list of messages', async () => {
    await createMessages({ studentId: 1, sprintId: 1, templateId: 1 })
    const { body } = await supertest(app).get('/messages').expect(200)
    expect(body).toHaveLength(1)
    expect(body).toEqual([
      {
        text: 'What an achievement! Congratulations, and let’s begin the celebration!',
        name: 'Mikael Lind',
        username: 'mikey',
        title: 'First Steps Into Programming with Python: Project',
      },
    ])
  })
})
