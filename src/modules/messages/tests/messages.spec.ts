import supertest from 'supertest'
import createTestDataBase from '@/tests/utils/createTestDataBase'
import { createFor } from '@/tests/utils/records'
import * as fixtures from './fixtures'
import createApp from '@/app'
import fetchGif from '@/utils/fetchGif'
import { StatusCodes } from 'http-status-codes'

const db = await createTestDataBase()

const app = createApp(db)

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

describe('POST', () => {
  it('should post the message of accomplishment for a specific student', async () => {
    const url = await fetchGif()
    await supertest(app)
      .post('/messages')
      .send({
        studentId: 1,
        sprintId: 1,
        templateId: 1,
        url: url,
      })
      .expect(201)
  })
})

describe('GET', () => {
  it('should return the list of messages', async () => {
    await createMessages({
      studentId: 1,
      sprintId: 1,
      templateId: 1,
      url: 'http//:example.com',
    })
    const { body } = await supertest(app).get('/messages').expect(200)
    expect(body).toHaveLength(1)
    expect(body).toEqual([
      {
        text: 'What an achievement! Congratulations, and let’s begin the celebration!',
        name: 'Mikael Lind',
        username: 'mikey',
        title: 'First Steps Into Programming with Python: Project',
        url: 'http//:example.com',
      },
    ])
  })

  it('should return an empty array of all congratulatory messages for a user that does not exist', async () => {
    const response = await supertest(app)
      .get('/messages')
      .query({ username: 'dally' }) // Add query parameters using .query();

    console.log(response.status) // Log the actual status code
    expect(response.body).toHaveLength(0)
  })

  it('should return an array of all congratulatory messages for a spocific user', async () => {
    await createMessages({
      studentId: 1,
      sprintId: 1,
      templateId: 1,
      url: 'http//:example.com',
    })
    const { body } = await supertest(app)
      .get('/messages')
      .query({ username: 'mikey' })
    expect(body).toHaveLength(1)
    expect(body).toEqual([
      {
        text: 'What an achievement! Congratulations, and let’s begin the celebration!',
        name: 'Mikael Lind',
        username: 'mikey',
        title: 'First Steps Into Programming with Python: Project',
        url: 'http//:example.com',
      },
    ])
  })
})

describe('PATCH', () => {
  it('should return a status METHOD_NOT_ALLOWED', async () => {
    await createMessages({
      studentId: 1,
      sprintId: 1,
      templateId: 1,
      url: 'http//:example.com',
    })

    const { body } = await supertest(app).patch('/messages').expect(405)

    expect(body.error.message).toEqual('Method not allowed')
  })
})
