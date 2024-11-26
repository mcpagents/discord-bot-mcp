import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from 'dotenv';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from 'zod';

import { config } from './config/index.js';
import { createDiscordClient, loginDiscordClient } from './services/discord-client.js';
import { toolDefinitions } from './tools/definitions.js';
import {
  handleSendMessage,
  handleReadMessages,
  handleListMembers,
  handleListChannels,
  handleListChannelThreads,
  handleEditThread,
  handleReadThreadMessages,
} from './tools/handlers/index.js';

// Load environment variables
dotenv.config();

// Create server instance
const server = new Server(config.server, config.capabilities);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions,
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "send-message":
        return await handleSendMessage(args);
      
      case "read-messages":
        return await handleReadMessages(args);

      case "list-members":
        return await handleListMembers(args);

      case "list-channels":
        return await handleListChannels(args);

      case "list-channel-threads":
        return await handleListChannelThreads(args);

      case "edit-thread":
        return await handleEditThread(args);

      case "read-thread-messages":
        return await handleReadThreadMessages(args);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid arguments: ${error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ")}`
      );
    }
    throw error;
  }
});

// Start the server
async function main() {
  // Check for Discord token
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error('DISCORD_TOKEN environment variable is not set');
  }
  
  try {
    // Initialize Discord client
    createDiscordClient();
    
    // Login to Discord
    await loginDiscordClient(token);

    // Start MCP server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Discord MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
  }
}

main();