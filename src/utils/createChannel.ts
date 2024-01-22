import { Client } from 'discord.js'

export async function createChannel(
  botClient: Client,
  DISCORD_CHANNEL_ID: string
) {
  const channel = botClient.channels.cache.get(DISCORD_CHANNEL_ID)
  return channel
}
