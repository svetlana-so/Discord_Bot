import { Client, GatewayIntentBits } from 'discord.js'

export default function createBot(botToken: string) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  client.on('ready', () => {
    console.log('Bot is ready')
  })

  client.login(botToken)

  return client
}
