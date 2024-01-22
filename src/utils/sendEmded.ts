import { TextChannel, EmbedBuilder } from 'discord.js'
import fetchGif from '@/utils/fetchGif'

type Records = [
  {
    username: string
    title: string
    text: string
  },
]

export default async function sendMessage(
  channel: TextChannel,
  records: Records
) {
  if (channel instanceof TextChannel) {
    const formattedMessage = formatTheMessage(records)
    const url = await fetchGif()
    const myEmbed = new EmbedBuilder()
      .setColor(0x9900ff)
      .setDescription(formattedMessage)
      .setImage(url as string)
      .setTimestamp()

    channel.send({ embeds: [myEmbed] })
  } else {
    console.error('Discord channel not found')
  }
}

function formatTheMessage(records: Records) {
  const formattedMessages = records.map((record) => {
    return `@${record.username} has just completed ${record.title}!\n${record.text}`
  })
  const formattedMessage = formattedMessages.join('\n\n')

  return formattedMessage
}
