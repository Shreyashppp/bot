module.exports = [
  {
    name: 'ping',
    description: 'Check bot status and responsiveness.',
    category: 'utility',
    usage: '/ping'
  },
  {
    name: 'help',
    description: 'Open the interactive help center.',
    category: 'utility',
    usage: '/help'
  },
  {
    name: 'ban',
    description: 'Ban a member from the server.',
    category: 'moderation',
    usage: '/ban <user>',
    options: [
      {
        name: 'user',
        description: 'User to ban',
        type: 6,
        required: true
      }
    ]
  },
  {
    name: 'kick',
    description: 'Kick a member from the server.',
    category: 'moderation',
    usage: '/kick <user>',
    options: [
      {
        name: 'user',
        description: 'User to kick',
        type: 6,
        required: true
      }
    ]
  },
  {
    name: 'mute',
    description: 'Temporarily timeout a member.',
    category: 'moderation',
    usage: '/mute <user>',
    options: [
      {
        name: 'user',
        description: 'User to mute',
        type: 6,
        required: true
      }
    ]
  },
  {
    name: 'purge',
    description: 'Delete multiple messages (1-100).',
    category: 'moderation',
    usage: '/purge <amount>',
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
