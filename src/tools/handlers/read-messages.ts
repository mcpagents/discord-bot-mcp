import { ReadMessagesSchema } from '../../utils/schemas.js';
import { findChannel } from '../../utils/discord-helpers.js';
import { ToolResponse, MessageData } from '../../types/index.js';

export async function handleReadMessages(args: unknown): Promise<ToolResponse> {
  const { channel: channelIdentifier, limit, server } = ReadMessagesSchema.parse(args);
  const channel = await findChannel(channelIdentifier, server);
  
  const messages = await channel.messages.fetch({ limit });
  const formattedMessages: MessageData[] = Array.from(messages.values()).map(msg => ({
    channel: `#${channel.name}`,
    server: channel.guild.name,
    author: msg.author.tag,
    content: msg.content,
    timestamp: msg.createdAt.toISOString(),
  }));

  return {
    content: [{
      type: "text",
      text: JSON.stringify(formattedMessages, null, 2),
    }],
  };
}