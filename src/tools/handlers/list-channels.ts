import { ChannelType } from 'discord.js';
import { ListChannelsSchema } from '../../utils/schemas.js';
import { findGuild } from '../../utils/discord-helpers.js';
import { ToolResponse, ChannelData } from '../../types/index.js';

export async function handleListChannels(args: unknown): Promise<ToolResponse> {
  const { server: serverIdentifier, type, detailed, page, limit } = ListChannelsSchema.parse(args);
  const guild = await findGuild(serverIdentifier);
  
  let channels = Array.from(guild.channels.cache.values());
  
  if (type !== 'all') {
    const typeMap: Record<string, ChannelType> = {
      'text': ChannelType.GuildText,
      'voice': ChannelType.GuildVoice,
      'category': ChannelType.GuildCategory,
      'forum': ChannelType.GuildForum,
      'announcement': ChannelType.GuildAnnouncement,
      'stage': ChannelType.GuildStageVoice,
    };
    channels = channels.filter(channel => channel.type === typeMap[type]);
  }
  
  channels.sort((a, b) => {
    const posA = 'position' in a ? a.position : 0;
    const posB = 'position' in b ? b.position : 0;
    return posA - posB;
  });
  
  const totalChannels = channels.length;
  const totalPages = Math.ceil(totalChannels / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedChannels = channels.slice(startIndex, endIndex);
  
  if (!detailed) {
    const channelTypeCounts: Record<string, number> = {};
    const channelsByType: Record<string, string[]> = {};
    
    for (const channel of channels) {
      const typeName = ChannelType[channel.type] || 'Unknown';
      channelTypeCounts[typeName] = (channelTypeCounts[typeName] || 0) + 1;
      
      if (!channelsByType[typeName]) {
        channelsByType[typeName] = [];
      }
      if (channelsByType[typeName].length < 5) {
        channelsByType[typeName].push(channel.name);
      }
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          server: guild.name,
          totalChannels,
          channelCounts: channelTypeCounts,
          sampleChannels: channelsByType,
          message: `Showing summary of ${totalChannels} channels. Use 'detailed: true' for full list with pagination.`
        }, null, 2),
      }],
    };
  }
  
  const formattedChannels: ChannelData[] = paginatedChannels.map(channel => ({
    id: channel.id,
    name: channel.name,
    type: ChannelType[channel.type],
    position: 'position' in channel ? channel.position : 0,
    parentId: channel.parentId,
    parentName: channel.parent?.name,
  }));

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        server: guild.name,
        pagination: {
          page,
          limit,
          totalChannels,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        channels: formattedChannels
      }, null, 2),
    }],
  };
}