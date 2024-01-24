import { z } from 'zod'
import type { Messages } from '@/database'

type Message = Messages

const schema = z.object({
  timestamp: z.coerce.date(),
  studentId: z.number().int().positive(),
  sprintId: z.number().int().positive(),
  templateId: z.number().int().positive().nullable(),
  url: z.string().url().nullable(),
})

const insertable = schema.omit({ timestamp: true })

export const parse = (record: unknown) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.studentId.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const keys: (keyof Message)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
