import supertest from 'supertest'
import createDatabase from '@/database'
import createApp from '@/app'

const db = createDatabase(process.env.DATABASE_URL as string, {
  readonly: true,
})

const botToken = process.env.DISCORD_BOT_ID

if (!botToken) {
  throw new Error('Provide botToken in your environment variables')
}

const app = createApp(db, botToken)

describe('GET', () => {
  it('return the list of templates', async () => {
    const { body } = await supertest(app).get('/templates').expect(201)
    expect(body).toHaveLength(2)
  })
})
