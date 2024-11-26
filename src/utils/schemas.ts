import { z } from 'zod';

export const SendMessageSchema = z.object({
  server: z.string().optional().describe('Server name or ID (optional if bot is only in one server)'),
  channel: z.string().describe('Channel name (e.g., "general") or ID'),
  message: z.string(),
});

export const ReadMessagesSchema = z.object({
  server: z.string().optional().describe('Server name or ID (optional if bot is only in one server)'),
  channel: z.string().describe('Channel name (e.g., "general") or ID'),
  limit: z.number().min(1).max(100).default(50),
});

export const ListMembersSchema = z.object({
  server: z.string().optional().describe('Server name or ID (optional if bot is only in one server)'),
  limit: z.number().min(1).max(100).default(50),
  includeRoles: z.boolean().default(true).describe('Include member roles in the response'),
  summary: z.boolean().default(true).describe('Return summary with role counts (default: true)'),
});

export const ListChannelsSchema = z.object({
  server: z.string().optional().describe('Server name or ID (optional if bot is only in one server)'),
  type: z.enum(['text', 'voice', 'category', 'forum', 'announcement', 'stage', 'all']).default('all').describe('Type of channels to list'),
  detailed: z.boolean().default(false).describe('Return detailed channel information (default: false, returns summary)'),
  page: z.number().min(1).default(1).describe('Page number for pagination (default: 1)'),
  limit: z.number().min(1).max(50).default(20).describe('Number of channels per page (default: 20, max: 50)'),
});

export const ListChannelThreadsSchema = z.object({
  server: z.string().optional().describe('Server name or ID (optional if bot is only in one server)'),
  channel: z.string().describe('Channel name or ID to list threads from'),
  archived: z.boolean().default(false).describe('Include archived threads'),
});

export const EditThreadSchema = z.object({
  server: z.string().optional().describe('Server name or ID (optional if bot is only in one server)'),
  thread: z.string().describe('Thread ID or name'),
  name: z.string().optional().describe('New name for the thread'),
  archived: z.boolean().optional().describe('Archive or unarchive the thread'),
  locked: z.boolean().optional().describe('Lock or unlock the thread'),
  autoArchiveDuration: z.enum(['60', '1440', '4320', '10080']).optional().describe('Auto-archive duration in minutes: 60 (1 hour), 1440 (1 day), 4320 (3 days), 10080 (1 week)'),
});

export const ReadThreadMessagesSchema = z.object({
  server: z.string().optional().describe('Server name or ID (optional if bot is only in one server)'),
  thread: z.string().describe('Thread ID or name'),
  limit: z.number().min(1).max(100).default(50).describe('Number of messages to fetch (default: 50, max: 100)'),
});