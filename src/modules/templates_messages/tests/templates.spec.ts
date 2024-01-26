import supertest from 'supertest'
import createTestDataBase from '@/tests/utils/createTestDataBase'
import { createFor } from '@/tests/utils/records'
import { templatesFactory, templatesMatcher } from './utils'
import createApp from '@/app'

const db = await createTestDataBase()

const app = createApp(db)

const createTemplates = createFor(db, 'templates')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('templates').execute()
})

describe('GET', () => {
  it('should return a list of templates', async () => {
    await createTemplates([
      templatesFactory(),
      templatesFactory({
        text: 'You did it!',
      }),
    ])

    const { body } = await supertest(app).get('/templates').expect(201)

    expect(body).toEqual([
      templatesMatcher(),
      templatesMatcher({
        text: 'You did it!',
      }),
    ])
  })

  it('should return an empty array of themplates', async () => {
    const { body } = await supertest(app).get('/templates').expect(201)

    expect(body).toHaveLength(0)
  })
})

describe('GET/:id', () => {
  it('should return 404 if the template is not found', async () => {
    const { body } = await supertest(app).get('/templates/999').expect(404)
    expect(body.error.message).toMatch('Template not found')
  })

  it('should return a template if exists', async () => {
    await createTemplates([
      templatesFactory({
        id: 1234,
      }),
    ])
    const { body } = await supertest(app).get('/templates/1234').expect(200)
    expect(body).toEqual(templatesMatcher({ id: 1234 }))
  })
})

describe('POST', () => {
  it('should return 201 if the template is created', async () => {
    await createTemplates([
      templatesFactory({
        id: 1234,
      }),
    ])
    const { body } = await supertest(app)
      .get('/templates')
      .send(templatesFactory())
      .expect(201)

    expect(body).toEqual([
      {
        id: 1234,
        text: 'What an achievement! Congratulations, and let’s begin the celebration!',
      },
    ])
  })
})

describe('PATCH', () => {
  it('should return 404 if the template is not found', async () => {
    const { body } = await supertest(app).get('/templates/999').expect(404)
    expect(body.error.message).toMatch('Template not found')
  })

  it('persists changes', async () => {
    const id = 888
    await createTemplates([templatesFactory({ id })])
    await supertest(app)
      .patch(`/templates/${id}`)
      .send({ text: 'Updated text!' })
      .expect(200)

    const { body } = await supertest(app).get('/templates/888').expect(200)
    expect(body).toEqual(templatesMatcher({ id, text: 'Updated text!' }))
  })
})

describe('DELITE', () => {
  it('it delite the sprint by provided id', async () => {
    const id = 1234
    await createTemplates([templatesFactory({ id })])
    await supertest(app).delete('/templates/1234').expect(200)
  })
  it('returns 404 if sprint is not found', async () => {
    const id = 1234
    await createTemplates([templatesFactory({ id })])
    await supertest(app).delete('/templates/999').expect(404)
  })
})
