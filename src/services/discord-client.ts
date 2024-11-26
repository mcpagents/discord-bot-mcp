import { Client, GatewayIntentBits } from 'discord.js';

let clientInstance: Client | null = null;

export function createDiscordClient(): Client {
  if (clientInstance) {
    return clientInstance;
  }

  clientInstance = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  clientInstance.once('ready', () => {
    console.error('Discord bot is ready!');
  });

  return clientInstance;
}

export function getDiscordClient(): Client {
  if (!clientInstance) {
    throw new Error('Discord client not initialized. Call createDiscordClient() first.');
  }
  return clientInstance;
}

export async function loginDiscordClient(token: string): Promise<void> {
  const client = getDiscordClient();
  await client.login(token);
}