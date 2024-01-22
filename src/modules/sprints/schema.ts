import { z } from 'zod'
import type { Sprints } from '@/database'

type Sprint = Sprints
const schema = z.object({
  id: z.coerce.number().int().positive(),
  sprintCode: z.string().startsWith('WD-', { message: 'Must start with WD' }),
  title: z.string().min(5).max(500),
})

const insertable = schema.omit({ id: true })
const updatable = insertable.partial()

export const parse = (record: unknown) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const perseUpdatable = (record: unknown) => updatable.parse(record)

export const keys: (keyof Sprint)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
