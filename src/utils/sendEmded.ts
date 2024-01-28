import { TextChannel, EmbedBuilder, Channel } from 'discord.js'

type Record = {
  username: string
  title: string
  text: string
  url: string
}

export default async function sendMessage(
  channel: Channel | undefined,
  records: Record[]
) {
  const formattedMessage = formatTheMessage(records)

  const myEmbed = new EmbedBuilder()
    .setColor(0x9900ff)
    .setDescription(formattedMessage)
    .setImage(records[0].url)
    .setTimestamp()

  if (!channel || !(channel instanceof TextChannel)) {
    console.warn('Invalid channel provided for sending messages.')
    return
  }
  channel.send({ embeds: [myEmbed] })
}

function formatTheMessage(records: Record[]) {
  const formattedMessages = records.map((record) => {
    return `@${record.username} has just completed ${record.title}!\n${record.text}`
  })
  const formattedMessage = formattedMessages.join('\n\n')

  return formattedMessage
}
