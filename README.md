# Discord MCP Server

A Model Context Protocol (MCP) server that enables LLMs to interact with Discord channels, allowing them to send and read messages through Discord's API. Using this server, LLMs like Claude can directly interact with Discord channels while maintaining user control and security.

## Features

- Send messages to Discord channels
- Read recent messages from channels
- List server members with roles
- List channels by type (text, voice, category, etc.)
- List and manage channel threads
- Edit thread properties (archive, lock, auto-archive duration)
- Automatic server and channel discovery
- Support for both channel names and IDs
- Proper error handling and validation

## Prerequisites

- Bun 1.x or higher (or Node.js 16.x or higher)
- A Discord bot token
- The bot must be invited to your server with proper permissions:
  - Read Messages/View Channels
  - Send Messages
  - Read Message History
  - View Server Members (for list-members tool)
  - Manage Threads (for edit-thread tool)

## Setup

1. Clone this repository:
```bash
git clone https://github.com/yourusername/discordmcp.git
cd discordmcp
```

2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file in the root directory with your Discord bot token:
```
DISCORD_TOKEN=your_discord_bot_token_here
```

4. For Bun users: No build step required! Bun can run TypeScript directly.
   
   For Node.js users: Build the server:
```bash
npm run build
```

## Usage with Claude for Desktop

1. Open your Claude for Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the Discord MCP server configuration:

   **For Bun (recommended - runs TypeScript directly):**
```json
{
  "mcpServers": {
    "discord": {
      "command": "bun",
      "args": ["path/to/discordmcp/src/index.ts"],
      "env": {
        "DISCORD_TOKEN": "your_discord_bot_token_here"
      }
    }
  }
}
```

   **For Node.js (requires build step):**
```json
{
  "mcpServers": {
    "discord": {
      "command": "node",
      "args": ["path/to/discordmcp/build/index.js"],
      "env": {
        "DISCORD_TOKEN": "your_discord_bot_token_here"
      }
    }
  }
}
```

3. Restart Claude for Desktop

## Available Tools

### send-message
Sends a message to a specified Discord channel.

Parameters:
- `server` (optional): Server name or ID (required if bot is in multiple servers)
- `channel`: Channel name (e.g., "general") or ID
- `message`: Message content to send

Example:
```json
{
  "channel": "general",
  "message": "Hello from MCP!"
}
```

### read-messages
Reads recent messages from a specified Discord channel.

Parameters:
- `server` (optional): Server name or ID (required if bot is in multiple servers)
- `channel`: Channel name (e.g., "general") or ID
- `limit` (optional): Number of messages to fetch (default: 50, max: 100)

Example:
```json
{
  "channel": "general",
  "limit": 10
}
```

### list-members
Lists members in a Discord server. Returns a summary by default to avoid large responses.

Parameters:
- `server` (optional): Server name or ID (required if bot is in multiple servers)
- `limit` (optional): Maximum number of members to return in detailed view (default: 50, max: 100)
- `includeRoles` (optional): Include member roles in the response (default: true)
- `summary` (optional): Return summary with role counts instead of full member list (default: true)

Example:
```json
{
  "summary": true,
  "includeRoles": true
}
```

For detailed member list:
```json
{
  "summary": false,
  "limit": 50,
  "includeRoles": true
}
```

### list-channels
Lists channels in a Discord server. Returns a summary by default to avoid large responses.

Parameters:
- `server` (optional): Server name or ID (required if bot is in multiple servers)
- `type` (optional): Type of channels to list - "text", "voice", "category", "forum", "announcement", "stage", or "all" (default: "all")
- `detailed` (optional): Return detailed channel information (default: false, returns summary)
- `page` (optional): Page number for pagination in detailed view (default: 1)
- `limit` (optional): Number of channels per page in detailed view (default: 20, max: 50)

Example for summary:
```json
{
  "type": "text",
  "detailed": false
}
```

Example for detailed view with pagination:
```json
{
  "type": "all",
  "detailed": true,
  "page": 1,
  "limit": 20
}
```

### list-channel-threads
Lists threads in a Discord channel.

Parameters:
- `server` (optional): Server name or ID (required if bot is in multiple servers)
- `channel`: Channel name or ID to list threads from
- `archived` (optional): Include archived threads (default: false)

Example:
```json
{
  "channel": "general",
  "archived": true
}
```

### edit-thread
Edits properties of a Discord thread.

Parameters:
- `server` (optional): Server name or ID (required if bot is in multiple servers)
- `thread`: Thread ID or name
- `name` (optional): New name for the thread
- `archived` (optional): Archive or unarchive the thread
- `locked` (optional): Lock or unlock the thread
- `autoArchiveDuration` (optional): Auto-archive duration in minutes - "60" (1 hour), "1440" (1 day), "4320" (3 days), or "10080" (1 week)

Example:
```json
{
  "thread": "bug-discussion",
  "archived": false,
  "autoArchiveDuration": "1440"
}
```

### read-thread-messages
Reads messages from a Discord thread.

Parameters:
- `server` (optional): Server name or ID (required if bot is in multiple servers)
- `thread`: Thread ID or name
- `limit` (optional): Number of messages to fetch (default: 50, max: 100)

Example:
```json
{
  "thread": "bug-discussion",
  "limit": 25
}
```

## Development

1. Install development dependencies:
```bash
bun install --dev typescript @types/node
```

2. Start the server in development mode:
```bash
bun run dev
```

## Testing

You can test the server using the MCP Inspector:

**With Bun (runs TypeScript directly):**
```bash
bunx @modelcontextprotocol/inspector bun src/index.ts
```

**With Node.js (requires build):**
```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## Examples

Here are some example interactions you can try with Claude after setting up the Discord MCP server:

1. "Can you read the last 5 messages from the general channel?"
2. "Please send a message to the announcements channel saying 'Meeting starts in 10 minutes'"
3. "What were the most recent messages in the development channel about the latest release?"
4. "List all the members in the server with their roles"
5. "Show me all text channels in the server"
6. "List all active threads in the general channel"
7. "Archive the thread called 'old-discussion' and set auto-archive to 1 day"
8. "Read the last 20 messages from the 'bug-discussion' thread"

Claude will use the appropriate tools to interact with Discord while asking for your approval before sending any messages.

## Security Considerations

- The bot requires proper Discord permissions to function
- All message sending operations require explicit user approval
- Environment variables should be properly secured
- Token should never be committed to version control
- Channel access is limited to channels the bot has been given access to

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the GitHub Issues section
2. Consult the MCP documentation at https://modelcontextprotocol.io
3. Open a new issue with detailed reproduction steps