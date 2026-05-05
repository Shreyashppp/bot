const logger = require('../utils/logger');

module.exports = {
  once: true,
  async execute(client) {
    logger.success(`Logged in as ${client.user.tag} (${client.user.id})`);
    logger.success(`Serving ${client.guilds.cache.size} guild(s) | ${client.commands.size} commands loaded`);

    client.user.setPresence({
      activities: [{ name: `/help | ${client.guilds.cache.size} servers`, type: 3 }],
      status: 'online',
    });

    setInterval(() => {
      client.user.setPresence({
        activities: [{ name: `/help | ${client.guilds.cache.size} servers`, type: 3 }],
        status: 'online',
      });
    }, 60_000);
  },
};
