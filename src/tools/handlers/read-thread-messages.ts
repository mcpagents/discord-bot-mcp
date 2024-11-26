import { ReadThreadMessagesSchema } from '../../utils/schemas.js';
import { findThread } from '../../utils/discord-helpers.js';
import { ToolResponse, MessageData } from '../../types/index.js';

export async function handleReadThreadMessages(args: unknown): Promise<ToolResponse> {
  const { server: serverIdentifier, thread: threadIdentifier, limit } = ReadThreadMessagesSchema.parse(args);
  const thread = await findThread(threadIdentifier, serverIdentifier);
  
  const messages = await thread.messages.fetch({ limit });
  
  const formattedMessages: MessageData[] = Array.from(messages.values())
    .reverse() // Reverse to show oldest first
    .map(msg => ({
      id: msg.id,
      author: msg.author.tag,
      authorId: msg.author.id,
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
      attachments: msg.attachments.size > 0 ? 
        msg.attachments.map(att => ({ name: att.name, url: att.url, size: att.size })) : 
        undefined,
      embeds: msg.embeds.length > 0 ? 
        msg.embeds.map(embed => ({ 
          title: embed.title, 
          description: embed.description,
          url: embed.url 
        })) : 
        undefined,
    }));

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        thread: thread.name,
        parentChannel: thread.parent?.name,
        server: thread.guild.name,
        messageCount: messages.size,
        archived: thread.archived,
        locked: thread.locked,
        messages: formattedMessages
      }, null, 2),
    }],
  };
}