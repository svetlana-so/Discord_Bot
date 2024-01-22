import createTestDataBase from '@/tests/utils/createTestDataBase'
import { createFor } from '@/tests/utils/records'
import buildRepository from '../repository'
import * as fixtures from './fixtures'
import { error } from 'console'

const db = await createTestDataBase()
const repository = buildRepository(db)
const createSprints = createFor(db, 'sprints')
const createTemplates = createFor(db, 'templates')
const createSrudents = createFor(db, 'students')

await createSprints(fixtures.sprints)
await createTemplates(fixtures.templates)
await createSrudents(fixtures.students)

beforeEach(async () => {
  await db.deleteFrom('messages').execute()
})

it('should create accomplishment and return information about a specific student', async () => {
  await repository.createAccomplishment({
    studentId: 1,
    sprintId: 1,
    templateId: 1,
  })
  const accomplishment = await repository.getInformationForPosting(1)
  expect(accomplishment).toHaveLength(1)
  expect(accomplishment).toEqual([
    {
      text: 'What an achievement! Congratulations, and let’s begin the celebration!',
      title: 'First Steps Into Programming with Python: Project',
      username: 'mikey',
    },
  ])
})
