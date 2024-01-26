import supertest from 'supertest'
import createTestDataBase from '@/tests/utils/createTestDataBase'
import createApp from '@/app'
import { omit } from 'lodash/fp'
import { studentsFactory, studentsMatcher } from './utuls'
import { createFor } from '@/tests/utils/records'

const db = await createTestDataBase()

const app = createApp(db)
const createStudents = createFor(db, 'students')

afterAll(() => db.destroy())
afterEach(async () => {
  await db.deleteFrom('students').execute()
})

describe('GET', () => {
  it('should return an empty list if there are no students', async () => {
    const { body } = await supertest(app).get('/students').expect(200)
    expect(body).toHaveLength(0)
  })

  it('should return a list of the existiong students', async () => {
    await createStudents([
      studentsFactory(),
      studentsFactory({ name: 'Mikael Lind', username: 'lind' }),
    ])
    const { body } = await supertest(app).get('/students').expect(200)
    expect(body).toHaveLength(2)
  })
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
      .send(
        studentsFactory({
          name: 'Svetlana Soboleva',
          username: 'sv_so',
        })
      )
      .expect(201)

    expect(body).toEqual(
      studentsMatcher({ name: 'Svetlana Soboleva', username: 'sv_so' })
    )
  })
})
