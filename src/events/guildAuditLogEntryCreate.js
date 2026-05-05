const { AuditLogEvent } = require('discord.js');
const { handleNuke } = require('./antinuke');

const ACTION_MAP = {
  [AuditLogEvent.MemberBanAdd]: 'mass_ban',
  [AuditLogEvent.MemberKick]: 'mass_kick',
  [AuditLogEvent.ChannelDelete]: 'mass_channel_delete',
  [AuditLogEvent.RoleDelete]: 'mass_role_delete',
  [AuditLogEvent.BotAdd]: 'bot_add',
  [AuditLogEvent.WebhookCreate]: 'webhook_create',
};

module.exports = {
  eventName: 'guildAuditLogEntryCreate',
  async execute(auditLog, guild, client) {
    const actionType = ACTION_MAP[auditLog.action];
    if (!actionType) return;
    const executor = auditLog.executor;
    if (!executor) return;
    await handleNuke(guild, executor, actionType, client);
  },
};
