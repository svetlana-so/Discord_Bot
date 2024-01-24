import createTestDataBase from '@/tests/utils/createTestDataBase'
import { createFor } from '@/tests/utils/records'
import buildRepository from '../repository'
import * as fixtures from './fixtures'

const db = await createTestDataBase()
const repository = buildRepository(db)
const createSprints = createFor(db, 'sprints')
const createTemplates = createFor(db, 'templates')
const createStudents = createFor(db, 'students')

await createSprints(fixtures.sprints)
await createTemplates(fixtures.templates)
await createStudents(fixtures.students)

describe('createAccomplishment, getInformationForPosting', () => {
  it('should create accomplishment and return information about a specific student', async () => {
    await repository.createAccomplishment({
      studentId: 1,
      sprintId: 1,
      templateId: 1,
      url: 'http//:example.com',
    })
    const accomplishment = await repository.getInformationForPosting(1)
    expect(accomplishment).toHaveLength(1)
    expect(accomplishment).toEqual([
      {
        text: 'What an achievement! Congratulations, and let’s begin the celebration!',
        title: 'First Steps Into Programming with Python: Project',
        username: 'mikey',
        url: 'http//:example.com',
      },
    ])
  })
})

describe('getAListOfAllCongratulatoryMessagesForASpecificUser', () => {
  it('return the information about user by providing a username', async () => {
    const accomplishment =
      await repository.getAListOfAllCongratulatoryMessagesForASpecificUser(
        'mikey'
      )
    expect(accomplishment).toEqual([
      {
        name: 'Mikael Lind',
        title: 'First Steps Into Programming with Python: Project',
        text: 'What an achievement! Congratulations, and let’s begin the celebration!',
        url: 'http//:example.com',
      },
    ])
  })
  it('it returns an empty array if the user is not found', async () => {
    const accomplishment =
      await repository.getAListOfAllCongratulatoryMessagesForASpecificUser(
        'julia'
      )
    expect(accomplishment).toEqual([])
  })
})

describe('getAListOfAllCongratulatoryMessagesForASpecificSprint', () => {
  it('returns the information by providing a sprint code', async () => {
    const accomplishment =
      await repository.getAListOfAllCongratulatoryMessagesForASpecificSprint(
        'WD-1.1'
      )
    expect(accomplishment).toEqual([
      {
        name: 'Mikael Lind',
        sprintCode: 'WD-1.1',
        title: 'First Steps Into Programming with Python: Project',
        text: 'What an achievement! Congratulations, and let’s begin the celebration!',
        url: 'http//:example.com',
      },
    ])
  })

  it('returns an empty array if there is no messages for the provided sprint code', async () => {
    const accomplishment =
      await repository.getAListOfAllCongratulatoryMessagesForASpecificSprint(
        'WD-1.2'
      )
    expect(accomplishment).toEqual([])
  })
})
