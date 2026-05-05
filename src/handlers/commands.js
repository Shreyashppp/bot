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
          const command = require(fullPath);
          if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
          }
          if (command.name && command.run) {
            client.prefixCommands.set(command.name, command);
            if (command.aliases) {
              command.aliases.forEach(a => client.prefixCommands.set(a, command));
            }
          }
          const name = command.data?.name || command.name;
          if (name) logger.info(`Loaded command: ${name}`);
        } catch (err) {
          logger.error(`Failed to load command ${fullPath}:`, err);
        }
      }
    }
  }

  readDir(commandsPath);
  logger.success(`Slash commands: ${client.commands.size} | Prefix commands: ${client.prefixCommands.size}`);
}

module.exports = { loadCommands };
