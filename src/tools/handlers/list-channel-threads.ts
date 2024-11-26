import { ThreadChannel } from 'discord.js';
import { ListChannelThreadsSchema } from '../../utils/schemas.js';
import { findChannel } from '../../utils/discord-helpers.js';
import { ToolResponse, ThreadData } from '../../types/index.js';

export async function handleListChannelThreads(args: unknown): Promise<ToolResponse> {
  const { server: serverIdentifier, channel: channelIdentifier, archived } = ListChannelThreadsSchema.parse(args);
  const channel = await findChannel(channelIdentifier, serverIdentifier);
  
  const threads: ThreadChannel[] = [];
  
  const activeThreads = await channel.threads.fetchActive();
  threads.push(...activeThreads.threads.values());
  
  if (archived) {
    try {
      const archivedThreads = await channel.threads.fetchArchived();
      threads.push(...archivedThreads.threads.values());
    } catch (error) {
      // Some permissions might prevent fetching archived threads
    }
  }
  
  const formattedThreads: ThreadData[] = threads.map(thread => ({
    id: thread.id,
    name: thread.name,
    archived: thread.archived,
    locked: thread.locked,
    autoArchiveDuration: thread.autoArchiveDuration,
    createdAt: thread.createdAt?.toISOString(),
    memberCount: thread.memberCount,
    messageCount: thread.messageCount,
  }));

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        channel: `#${channel.name}`,
        server: channel.guild.name,
        threads: formattedThreads
      }, null, 2),
    }],
  };
}