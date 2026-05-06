const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

async function loadCommands(client) {
  const commandsPath = path.join(__dirname, '../commands');

  function readDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        readDir(fullPath);
      } else if (entry.name.endsWith('.js')) {
        try {
          // Clear require cache so hot-restarts load fresh copies
          delete require.cache[require.resolve(fullPath)];
          const command = require(fullPath);

          if (command.data && typeof command.execute === 'function') {
            if (client.commands.has(command.data.name)) {
              logger.warn(`[COMMANDS] Duplicate slash command skipped: ${command.data.name}`);
            } else {
              client.commands.set(command.data.name, command);
            }
          }

          if (command.name && typeof command.run === 'function') {
            if (!client.prefixCommands.has(command.name)) {
              client.prefixCommands.set(command.name, command);
            }
            if (command.aliases) {
              for (const alias of command.aliases) {
                if (!client.prefixCommands.has(alias)) {
                  client.prefixCommands.set(alias, command);
                }
              }
            }
          }

          const label = command.data?.name || command.name;
          if (label) logger.info(`Loaded command: ${label}`);
        } catch (err) {
          logger.error(`Failed to load ${fullPath}: ${err.message}`);
        }
      }
    }
  }

  readDir(commandsPath);
  logger.info(`[COMMANDS] Slash: ${client.commands.size} | Prefix: ${client.prefixCommands.size}`);
}

module.exports = { loadCommands };
