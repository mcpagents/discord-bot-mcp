import { Guild, TextChannel, ThreadChannel, NewsChannel } from 'discord.js';
import { getDiscordClient } from '../services/discord-client.js';

export async function findGuild(guildIdentifier?: string): Promise<Guild> {
  const client = getDiscordClient();
  
  if (!guildIdentifier) {
    if (client.guilds.cache.size === 1) {
      return client.guilds.cache.first()!;
    }
    const guildList = Array.from(client.guilds.cache.values())
      .map(g => `"${g.name}"`).join(', ');
    throw new Error(`Bot is in multiple servers. Please specify server name or ID. Available servers: ${guildList}`);
  }

  try {
    const guild = await client.guilds.fetch(guildIdentifier);
    if (guild) return guild;
  } catch {
    const guilds = client.guilds.cache.filter(
      g => g.name.toLowerCase() === guildIdentifier.toLowerCase()
    );
    
    if (guilds.size === 0) {
      const availableGuilds = Array.from(client.guilds.cache.values())
        .map(g => `"${g.name}"`).join(', ');
      throw new Error(`Server "${guildIdentifier}" not found. Available servers: ${availableGuilds}`);
    }
    if (guilds.size > 1) {
      const guildList = guilds.map(g => `${g.name} (ID: ${g.id})`).join(', ');
      throw new Error(`Multiple servers found with name "${guildIdentifier}": ${guildList}. Please specify the server ID.`);
    }
    return guilds.first()!;
  }
  throw new Error(`Server "${guildIdentifier}" not found`);
}

export async function findChannel(channelIdentifier: string, guildIdentifier?: string): Promise<TextChannel> {
  const client = getDiscordClient();
  const guild = await findGuild(guildIdentifier);
  
  try {
    const channel = await client.channels.fetch(channelIdentifier);
    if (channel instanceof TextChannel && channel.guild.id === guild.id) {
      return channel;
    }
  } catch {
    const channels = guild.channels.cache.filter(
      (channel): channel is TextChannel =>
        channel instanceof TextChannel &&
        (channel.name.toLowerCase() === channelIdentifier.toLowerCase() ||
         channel.name.toLowerCase() === channelIdentifier.toLowerCase().replace('#', ''))
    );

    if (channels.size === 0) {
      const availableChannels = guild.channels.cache
        .filter((c): c is TextChannel => c instanceof TextChannel)
        .map(c => `"#${c.name}"`).join(', ');
      throw new Error(`Channel "${channelIdentifier}" not found in server "${guild.name}". Available channels: ${availableChannels}`);
    }
    if (channels.size > 1) {
      const channelList = channels.map(c => `#${c.name} (${c.id})`).join(', ');
      throw new Error(`Multiple channels found with name "${channelIdentifier}" in server "${guild.name}": ${channelList}. Please specify the channel ID.`);
    }
    return channels.first()!;
  }
  throw new Error(`Channel "${channelIdentifier}" is not a text channel or not found in server "${guild.name}"`);
}

export async function findThread(threadIdentifier: string, guildIdentifier?: string): Promise<ThreadChannel> {
  const client = getDiscordClient();
  const guild = await findGuild(guildIdentifier);
  
  try {
    const thread = await client.channels.fetch(threadIdentifier);
    if (thread instanceof ThreadChannel && thread.guild.id === guild.id) {
      return thread;
    }
  } catch {
    const threads: ThreadChannel[] = [];
    
    for (const channel of guild.channels.cache.values()) {
      if (channel instanceof TextChannel || channel instanceof NewsChannel) {
        const activeThreads = await channel.threads.fetchActive();
        threads.push(...activeThreads.threads.values());
        
        try {
          const archivedThreads = await channel.threads.fetchArchived();
          threads.push(...archivedThreads.threads.values());
        } catch {
          // Ignore errors when fetching archived threads
        }
      }
    }
    
    const matchingThreads = threads.filter(t => 
      t.name.toLowerCase() === threadIdentifier.toLowerCase()
    );
    
    if (matchingThreads.length === 0) {
      throw new Error(`Thread "${threadIdentifier}" not found in server "${guild.name}"`);
    }
    if (matchingThreads.length > 1) {
      const threadList = matchingThreads.map(t => `${t.name} (${t.id}) in #${t.parent?.name}`).join(', ');
      throw new Error(`Multiple threads found with name "${threadIdentifier}": ${threadList}. Please specify the thread ID.`);
    }
    return matchingThreads[0];
  }
  throw new Error(`Thread "${threadIdentifier}" not found in server "${guild.name}"`);
}