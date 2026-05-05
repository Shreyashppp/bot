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
            logger.info(`Loaded command: ${command.data.name}`);
          }
        } catch (err) {
          logger.error(`Failed to load command ${fullPath}:`, err);
        }
      }
    }
  }

  readDir(commandsPath);
  logger.success(`Total commands loaded: ${client.commands.size}`);
}

module.exports = { loadCommands };
