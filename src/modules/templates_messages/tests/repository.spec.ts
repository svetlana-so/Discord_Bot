import createTestDataBase from '@/tests/utils/createTestDataBase'
import { createFor, selectAllFor } from '@/tests/utils/records'
import buildRepository from '../repository'
import { templatesFactory, templatesMatcher } from './utils'

const db = await createTestDataBase()
const repository = buildRepository(db)
const createTemplates = createFor(db, 'templates')
const selectTemplates = selectAllFor(db, 'templates')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('templates').execute()
})

describe('findAll', () => {
  it('should return all messages', async () => {
    await createTemplates([
      templatesFactory({ text: 'Text 1' }),
      templatesFactory({ text: 'Text 2' }),
    ])
    const templates = await repository.findAll()
    expect(templates).toHaveLength(2)
    expect(templates[0]).toEqual(templatesMatcher({ text: 'Text 1' }))
  })
})

describe('findById', () => {
  it('should return underfined if there is no template with this id', async () => {
    const foundTemplate = await repository.findById(999)
    expect(foundTemplate).toBeUndefined()
  })

  it('should return article by Id', async () => {
    const [template] = await createTemplates(templatesFactory({ id: 123 }))
    const foundArticle = await repository.findById(template.id)
    expect(foundArticle).toEqual(templatesMatcher())
  })
})

describe('addMessage', () => {
  it('should create a template', async () => {
    const template = await repository.addMessage(templatesFactory())
    expect(template).toEqual(templatesMatcher())

    const templatesInDB = await selectTemplates()
    expect(templatesInDB).toEqual([template])
  })
})

describe('update', () => {
  it('should return an original template if no changes are made', async () => {
    const [template] = await createTemplates(templatesFactory())
    const updatedTemplate = await repository.update(template.id, {})

    expect(updatedTemplate).toEqual(templatesMatcher())
  })

  it('should update a template', async () => {
    const [template] = await createTemplates(templatesFactory())
    const updatedTemplate = await repository.update(template.id, {
      text: 'Updated text',
    })
    expect(updatedTemplate).toMatchObject(
      templatesMatcher({ text: 'Updated text' })
    )
  })

  it('should return underfined if the template id is not found', async () => {
    const updatedTemplate = await repository.update(999, {
      text: 'Updated text',
    })
    expect(updatedTemplate).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove a template', async () => {
    const [template] = await createTemplates(templatesFactory())
    const removedTemplate = await repository.remove(template.id)
    expect(removedTemplate).toEqual(templatesMatcher())
  })

  it('should return underfined if the template id is not found', async () => {
    const removedTemplate = await repository.remove(999)
    expect(removedTemplate).toBeUndefined()
  })
})
