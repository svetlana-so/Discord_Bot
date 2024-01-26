import { TextChannel } from 'discord.js'
import sendMessage from '@/utils/sendEmded'


const channel = {
  send: vi.fn(),
} as unknown as TextChannel

describe('', () => {
  it('should call sendMessage', async () => {
    const record = [
      {
        username: '',
        title: '',
        text: '',
        url: 'http://example.com',
      },
    ]

    await sendMessage(channel, record)

    expect(channel.send).toHaveBeenCalledTimes(1)
    
  })
})
