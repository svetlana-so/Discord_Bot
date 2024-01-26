import { studentsFactory, studentsMatcher } from './utuls'
import createTestDataBase from '@/tests/utils/createTestDataBase'
import buildRepository from '../repository'
import { createFor, selectAllFor } from '@/tests/utils/records'

const db = await createTestDataBase()
const repository = buildRepository(db)
const createStudents = createFor(db, 'students')
const selectStudents = selectAllFor(db, 'students')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('students').execute()
})

describe('addStudent', () => {
  it('should add a student', async () => {
    const student = await repository.addStudent(studentsFactory())
    expect(student).toEqual(studentsMatcher())

    const studentInDataBase = await selectStudents()
    expect(studentInDataBase).toEqual([student])
  })
})

describe('findAll', () => {
  it('should return a list of all students', async () => {
    await createStudents([
      studentsFactory({ name: 'Mikael Lind', username: 'lind' }),
      studentsFactory({ name: 'Daniel Pedersen', username: 'dally' }),
    ])
    const students = await repository.findAll()
    expect(students).toHaveLength(2)
    expect(students[0]).toEqual(
      studentsMatcher({ name: 'Mikael Lind', username: 'lind' })
    )
  })
})
