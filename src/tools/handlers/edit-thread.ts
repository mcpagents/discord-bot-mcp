import { ThreadAutoArchiveDuration } from 'discord.js';
import { EditThreadSchema } from '../../utils/schemas.js';
import { findThread } from '../../utils/discord-helpers.js';
import { ToolResponse } from '../../types/index.js';

export async function handleEditThread(args: unknown): Promise<ToolResponse> {
  const { server: serverIdentifier, thread: threadIdentifier, name, archived, locked, autoArchiveDuration } = EditThreadSchema.parse(args);
  const thread = await findThread(threadIdentifier, serverIdentifier);
  
  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (archived !== undefined) updates.archived = archived;
  if (locked !== undefined) updates.locked = locked;
  if (autoArchiveDuration !== undefined) {
    const durationMap: Record<string, ThreadAutoArchiveDuration> = {
      '60': ThreadAutoArchiveDuration.OneHour,
      '1440': ThreadAutoArchiveDuration.OneDay,
      '4320': ThreadAutoArchiveDuration.ThreeDays,
      '10080': ThreadAutoArchiveDuration.OneWeek,
    };
    updates.autoArchiveDuration = durationMap[autoArchiveDuration];
  }
  
  await thread.edit(updates);
  
  return {
    content: [{
      type: "text",
      text: `Thread "${thread.name}" updated successfully in server "${thread.guild.name}". Changes applied: ${JSON.stringify(updates, null, 2)}`,
    }],
  };
}