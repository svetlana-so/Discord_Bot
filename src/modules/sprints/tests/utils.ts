import { expect } from 'vitest'
import type { Sprints } from '@/database'
import type { Insertable } from 'kysely'

export const sprintsFactory = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  sprintCode: 'Some code',
  title: 'Some title',
  ...overrides,
})

export const sprintsMatcher = (
  overrides: Partial<Insertable<Sprints>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...sprintsFactory(overrides),
})
