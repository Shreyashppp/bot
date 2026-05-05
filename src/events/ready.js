const logger = require('../utils/logger');

module.exports = {
  eventName: 'clientReady',
  once: true,
  execute(client) {
    logger.success(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: `${client.guilds.cache.size} servers | .help`, type: 3 }],
      status: 'online',
    });
  },
};
