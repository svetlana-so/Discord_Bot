import { expect } from 'vitest'
import type { Students } from '@/database'
import type { Insertable } from 'kysely'

export const studentsFactory = (
  overrides: Partial<Insertable<Students>> = {}
): Insertable<Students> => ({
  name: 'My Name',
  username: 'username',
  ...overrides,
})

export const studentsFactoryFull = (
  overrides: Partial<Insertable<Students>> = {}
): Students => ({
  //@ts-ignore
  id: 1,
  ...studentsFactory(overrides),
})

export const studentsMatcher = (
  overrides: Partial<Insertable<Students>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...studentsFactory(overrides),
})
