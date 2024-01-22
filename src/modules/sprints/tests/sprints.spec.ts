import supertest from 'supertest'
import createTestDataBase from '@/tests/utils/createTestDataBase'
import { createFor } from '@/tests/utils/records'
import { omit } from 'lodash/fp'
import createApp from '@/app'
import { sprintsFactory, sprintsMatcher } from './utils'

const db = await createTestDataBase()
const { DISCORD_BOT_ID } = process.env

if (!DISCORD_BOT_ID) {
  throw new Error('Provide DISCORD_BOT_TOKEN in your environment variables')
}

const app = createApp(db, DISCORD_BOT_ID)
const createSprints = createFor(db, 'sprints')

afterEach(async () => {
  await db.deleteFrom('sprints').execute()
})
afterAll(() => db.destroy())

describe('GET', () => {
  it('should return an empty array of sprints when there are no sprit', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200)
    expect(body).toHaveLength(0)
  })
  it('shpould return a list of existinf sprints', async () => {
    await createSprints([
      sprintsFactory(),
      sprintsFactory({
        sprintCode: 'WD_1.1',
        title: 'Some title',
      }),
    ])
    const { body } = await supertest(app).get('/sprints').expect(200)
    expect(body).toEqual([
      sprintsMatcher(),
      sprintsMatcher({
        sprintCode: 'WD_1.1',
        title: 'Some title',
      }),
    ])
  })
})

describe('GET/:id', () => {
  it('should return 405 if sprint does not exist', async () => {
    const { body } = await supertest(app).get('/sprints/999').expect(405)
    expect(body.error.message).toEqual('Method not allowed')
  })

  it('should return a sprint if exists', async () => {
    await createSprints([
      sprintsFactory({
        id: 123,
      }),
    ])
    const { body } = await supertest(app).get('/sprints/123').expect(200)
    expect(body).toEqual(
      sprintsMatcher({
        id: 123,
      })
    )
  })
})

describe('POST', () => {
  it('it will return an error if sprintCode is missing', async () => {
    await supertest(app)
      .post('/sprints')
      .send(omit(['sprintCode'], sprintsFactory({})))
      .expect(400)
  })
  it('it will return an error if tittle is missing', async () => {
    await supertest(app)
      .post('/sprints')
      .send(omit(['title'], sprintsFactory({})))
      .expect(400)
  })

  it('it is not allowed to create a sprint with empty sprintCode', async () => {
    await supertest(app)
      .post('/sprints')
      .send(sprintsFactory({ sprintCode: '' }))
      .expect(400)
  })

  it('return 201 when the sprint is created', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send({
        sprintCode: 'WD-1.4',
        title: 'Computer Science Fundamentals: Project',
      })
      .expect(201)
    expect(body).toEqual({
      id: expect.any(Number),
      sprintCode: 'WD-1.4',
      title: 'Computer Science Fundamentals: Project',
    })
  })
})

describe('PATCH', () => {
  it('should return 405 if sprint does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/sprints/999')
      .send({
        sprintCode: 'WD-1.4',
        title: 'Computer Science Fundamentals: Project',
      })
      .expect(405)
    expect(body.error.message).toEqual('Method not allowed')
  })

  it('it allows partial update', async () => {
    const id = 1234
    await createSprints([sprintsFactory({ id })])
    const { body } = await supertest(app)
      .patch(`/sprints/${1234}`)
      .send({ title: 'Updated' })
    expect(200)
    expect(body).toEqual(
      sprintsMatcher({
        id,
        title: 'Updated',
      })
    )
  })

  it('it allows fully update the sprint', async () => {
    const id = 1234
    await createSprints([sprintsFactory({ id })])
    const { body } = await supertest(app)
      .patch(`/sprints/${1234}`)
      .send({ sprintCode: 'WD-1.4', title: 'Updated' })
    expect(200)
    expect(body).toEqual(
      sprintsMatcher({
        id,
        sprintCode: 'WD-1.4',
        title: 'Updated',
      })
    )
  })
})

describe('DELITE', () => {
  it('does not support deliting', async () => {
    await supertest(app).delete('/sprints/123').expect(404)
  })
})
