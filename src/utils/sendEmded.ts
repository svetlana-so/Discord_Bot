import { TextChannel, EmbedBuilder } from 'discord.js'

type Record = {
  username: string
  title: string
  text: string
  url: string
}

export default async function sendMessage(
  channel: TextChannel,
  records: Record[]
) {
  if (channel instanceof TextChannel) {
    const formattedMessage = formatTheMessage(records)

    const myEmbed = new EmbedBuilder()
      .setColor(0x9900ff)
      .setDescription(formattedMessage)
      .setImage(records[0].url)
      .setTimestamp()

    channel.send({ embeds: [myEmbed] })
  } else {
    console.error('Discord channel not found')
  }
}

function formatTheMessage(records: Record[]) {
  const formattedMessages = records.map((record) => {
    return `@${record.username} has just completed ${record.title}!\n${record.text}`
  })
  const formattedMessage = formattedMessages.join('\n\n')

  return formattedMessage
}
