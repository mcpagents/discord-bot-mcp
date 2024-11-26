import { ListMembersSchema } from '../../utils/schemas.js';
import { findGuild } from '../../utils/discord-helpers.js';
import { ToolResponse, MemberData } from '../../types/index.js';

export async function handleListMembers(args: unknown): Promise<ToolResponse> {
  const { server: serverIdentifier, limit, includeRoles, summary } = ListMembersSchema.parse(args);
  const guild = await findGuild(serverIdentifier);
  
  if (summary) {
    const allMembers = await guild.members.fetch();
    
    const roleCounts: Record<string, number> = {};
    const botCount = allMembers.filter(m => m.user.bot).size;
    const humanCount = allMembers.size - botCount;
    
    allMembers.forEach(member => {
      member.roles.cache.forEach(role => {
        if (role.name !== '@everyone') {
          roleCounts[role.name] = (roleCounts[role.name] || 0) + 1;
        }
      });
    });
    
    const sampleMembers: MemberData[] = Array.from(allMembers.values()).slice(0, 10).map(member => ({
      username: member.user.username,
      displayName: member.displayName,
      isBot: member.user.bot,
      roles: includeRoles ? member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.name) as any : undefined
    }));
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          server: guild.name,
          totalMembers: guild.memberCount,
          humanMembers: humanCount,
          botMembers: botCount,
          roleCounts,
          sampleMembers,
          message: `Showing summary of ${guild.memberCount} members. Use 'summary: false' for detailed member list.`
        }, null, 2),
      }],
    };
  }
  
  const members = await guild.members.fetch({ limit });
  
  const formattedMembers: MemberData[] = Array.from(members.values()).map(member => {
    const memberData: MemberData = {
      id: member.id,
      username: member.user.username,
      displayName: member.displayName,
      joinedAt: member.joinedAt?.toISOString(),
      isBot: member.user.bot,
    };
    
    if (includeRoles) {
      memberData.roles = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => ({ name: role.name, color: role.hexColor }));
    }
    
    return memberData;
  });

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        server: guild.name,
        totalMembers: guild.memberCount,
        membersShown: members.size,
        members: formattedMembers,
        message: members.size < guild.memberCount ? 
          `Showing ${members.size} of ${guild.memberCount} members. Increase 'limit' to see more.` : 
          undefined
      }, null, 2),
    }],
  };
}