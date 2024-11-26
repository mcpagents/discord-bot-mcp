export const toolDefinitions = [
  {
    name: "send-message",
    description: "Send a message to a Discord channel",
    inputSchema: {
      type: "object",
      properties: {
        server: {
          type: "string",
          description: 'Server name or ID (optional if bot is only in one server)',
        },
        channel: {
          type: "string",
          description: 'Channel name (e.g., "general") or ID',
        },
        message: {
          type: "string",
          description: "Message content to send",
        },
      },
      required: ["channel", "message"],
    },
  },
  {
    name: "read-messages",
    description: "Read recent messages from a Discord channel",
    inputSchema: {
      type: "object",
      properties: {
        server: {
          type: "string",
          description: 'Server name or ID (optional if bot is only in one server)',
        },
        channel: {
          type: "string",
          description: 'Channel name (e.g., "general") or ID',
        },
        limit: {
          type: "number",
          description: "Number of messages to fetch (max 100)",
          default: 50,
        },
      },
      required: ["channel"],
    },
  },
  {
    name: "list-members",
    description: "List members in a Discord server",
    inputSchema: {
      type: "object",
      properties: {
        server: {
          type: "string",
          description: 'Server name or ID (optional if bot is only in one server)',
        },
        limit: {
          type: "number",
          description: "Maximum number of members to return (default: 50, max: 100)",
          default: 50,
        },
        includeRoles: {
          type: "boolean",
          description: "Include member roles in the response",
          default: true,
        },
        summary: {
          type: "boolean",
          description: "Return summary with role counts (default: true)",
          default: true,
        },
      },
      required: [],
    },
  },
  {
    name: "list-channels",
    description: "List channels in a Discord server",
    inputSchema: {
      type: "object",
      properties: {
        server: {
          type: "string",
          description: 'Server name or ID (optional if bot is only in one server)',
        },
        type: {
          type: "string",
          description: "Type of channels to list (text, voice, category, forum, announcement, stage, all)",
          enum: ["text", "voice", "category", "forum", "announcement", "stage", "all"],
          default: "all",
        },
        detailed: {
          type: "boolean",
          description: "Return detailed channel information (default: false, returns summary)",
          default: false,
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
          default: 1,
        },
        limit: {
          type: "number",
          description: "Number of channels per page (default: 20, max: 50)",
          default: 20,
        },
      },
      required: [],
    },
  },
  {
    name: "list-channel-threads",
    description: "List threads in a Discord channel",
    inputSchema: {
      type: "object",
      properties: {
        server: {
          type: "string",
          description: 'Server name or ID (optional if bot is only in one server)',
        },
        channel: {
          type: "string",
          description: 'Channel name or ID to list threads from',
        },
        archived: {
          type: "boolean",
          description: "Include archived threads",
          default: false,
        },
      },
      required: ["channel"],
    },
  },
  {
    name: "edit-thread",
    description: "Edit properties of a Discord thread",
    inputSchema: {
      type: "object",
      properties: {
        server: {
          type: "string",
          description: 'Server name or ID (optional if bot is only in one server)',
        },
        thread: {
          type: "string",
          description: 'Thread ID or name',
        },
        name: {
          type: "string",
          description: "New name for the thread",
        },
        archived: {
          type: "boolean",
          description: "Archive or unarchive the thread",
        },
        locked: {
          type: "boolean",
          description: "Lock or unlock the thread",
        },
        autoArchiveDuration: {
          type: "string",
          description: "Auto-archive duration in minutes: 60 (1 hour), 1440 (1 day), 4320 (3 days), 10080 (1 week)",
          enum: ["60", "1440", "4320", "10080"],
        },
      },
      required: ["thread"],
    },
  },
  {
    name: "read-thread-messages",
    description: "Read messages from a Discord thread",
    inputSchema: {
      type: "object",
      properties: {
        server: {
          type: "string",
          description: 'Server name or ID (optional if bot is only in one server)',
        },
        thread: {
          type: "string",
          description: 'Thread ID or name',
        },
        limit: {
          type: "number",
          description: "Number of messages to fetch (default: 50, max: 100)",
          default: 50,
        },
      },
      required: ["thread"],
    },
  },
];