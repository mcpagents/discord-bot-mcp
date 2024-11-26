import { SendMessageSchema } from '../../utils/schemas.js';
import { findChannel } from '../../utils/discord-helpers.js';
import { ToolResponse } from '../../types/index.js';

export async function handleSendMessage(args: unknown): Promise<ToolResponse> {
  const { channel: channelIdentifier, message, server } = SendMessageSchema.parse(args);
  const channel = await findChannel(channelIdentifier, server);
  
  const sent = await channel.send(message);
  return {
    content: [{
      type: "text",
      text: `Message sent successfully to #${channel.name} in ${channel.guild.name}. Message ID: ${sent.id}`,
    }],
  };
}