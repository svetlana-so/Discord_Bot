import createTestDataBase from '@/tests/utils/createTestDataBase'
import { createFor, selectAllFor } from '@/tests/utils/records'
import buildRepository from '../repository'
import { sprintsFactory, sprintsMatcher } from './utils'

const db = await createTestDataBase()
const repository = buildRepository(db)

const createSprints = createFor(db, 'sprints')
const selectSprints = selectAllFor(db, 'sprints')

afterAll(() => db.destroy())
afterEach(async () => {
  await db.deleteFrom('sprints').execute()
})

describe('findAll', () => {
  it('should return a list of sprints', async () => {
    await createSprints([
      sprintsFactory({
        sprintCode: 'WD_1.1',
      }),
      sprintsFactory({
        sprintCode: 'WD_1.2',
      }),
    ])
    const sprints = await repository.findAll()
    expect(sprints).toHaveLength(2)
    expect(sprints[0]).toEqual(sprintsMatcher({ sprintCode: 'WD_1.1' }))
    expect(sprints[1]).toEqual(sprintsMatcher({ sprintCode: 'WD_1.2' }))
  })
})

describe('findById', () => {
  it('should return a sprint by id', async () => {
    const [sprint] = await createSprints(
      sprintsFactory({
        id: 123,
      })
    )
    const foundSprint = await repository.findById(sprint.id)
    expect(foundSprint).toEqual(sprintsMatcher())
  })
})

describe('update', () => {
  it('should update a sprint', async () => {
    const [sprint] = await createSprints(sprintsFactory())
    const updatedSprint = await repository.update(sprint.id, {
      title: 'Updated Title',
    })
    expect(updatedSprint).toEqual(sprintsMatcher({ title: 'Updated Title' }))
  })

  it('should return an original sprint if no changes are made', async () => {
    const [sprint] = await createSprints(sprintsFactory())

    const updatedSprint = await repository.update(sprint.id, {})
    expect(updatedSprint).toMatchObject(sprintsMatcher())
  })

  it('should return underfined if sprint is not found', async () => {
    const updatedSprint = await repository.update(999, {
      title: 'Updated title',
    })
    expect(updatedSprint).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove a sprint', async () => {
    const [sprint] = await createSprints(sprintsFactory())
    const removedSprint = await repository.remove(sprint.id)
    expect(removedSprint).toEqual(sprintsMatcher())
  })
  it('should return underfined if sprint is not found', async () => {
    const removedSprint = await repository.remove(123)
    expect(removedSprint).toBeUndefined()
  })
})

describe('create', () => {
  it('should create a sprint', async () => {
    const sprint = await repository.addSprint(sprintsFactory())
    expect(sprint).toEqual(sprintsMatcher())
    const sprintInDataBase = await selectSprints()
    expect(sprintInDataBase).toEqual([sprint])
  })
})
