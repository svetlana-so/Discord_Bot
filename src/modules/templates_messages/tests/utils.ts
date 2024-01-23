import { expect } from 'vitest'
import type { Templates } from '@/database'
import type { Insertable } from 'kysely'

export const templatesFactory = (
  overrides: Partial<Insertable<Templates>> = {}
): Insertable<Templates> => ({
  text: 'What an achievement! Congratulations, and let’s begin the celebration!',
  ...overrides,
})

export const templatesMatcher = (
  overrides: Partial<Insertable<Templates>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...templatesFactory(overrides),
})
