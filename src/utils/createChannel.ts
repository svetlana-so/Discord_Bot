import { Client } from 'discord.js'

export async function createChannel(
  botClient: Client | undefined,
  DISCORD_CHANNEL_ID: string | undefined
) {
  if (!botClient) {
    console.warn(
      'Bot is undefined. The channel creation will not be performed.'
    )
    return undefined
  }
  if (!DISCORD_CHANNEL_ID) {
    console.log('Discord channel not found.')
    return undefined
  }
  const channel = botClient.channels.cache.get(DISCORD_CHANNEL_ID)
  return channel
}
