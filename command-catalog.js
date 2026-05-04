module.exports = [
  {
    name: 'ping',
    description: 'Check bot status, websocket latency, and response speed.',
    category: 'utility',
    usage: '/ping'
  },
  {
    name: 'help',
    description: 'Open the interactive command center with categories and usage guides.',
    category: 'utility',
    usage: '/help'
  },
  {
    name: 'ban',
    description: 'Ban a member from the server with an optional moderation reason.',
    category: 'moderation',
    usage: '/ban user:<member> [reason:<text>]',
    options: [
      {
        name: 'user',
        description: 'User to ban',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for the ban',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'kick',
    description: 'Kick a member from the server with an optional moderation reason.',
    category: 'moderation',
    usage: '/kick user:<member> [reason:<text>]',
    options: [
      {
        name: 'user',
        description: 'User to kick',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'Reason for the kick',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'mute',
    description: 'Temporarily timeout a member for a chosen number of minutes.',
    category: 'moderation',
    usage: '/mute user:<member> [duration:<minutes>] [reason:<text>]',
    options: [
      {
        name: 'user',
        description: 'User to mute',
        type: 6,
        required: true
      },
      {
        name: 'duration',
        description: 'Timeout duration in minutes (default: 10)',
        type: 4,
        required: false
      },
      {
        name: 'reason',
        description: 'Reason for the timeout',
        type: 3,
        required: false
      }
    ]
  },
  {
    name: 'purge',
    description: 'Delete multiple messages in bulk (1-100) from the current channel.',
    category: 'moderation',
    usage: '/purge amount:<1-100>',
    options: [
      {
        name: 'amount',
        description: 'Number of messages to delete',
        type: 4,
        required: true
      }
    ]
  }
];
