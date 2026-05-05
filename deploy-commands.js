require('dotenv').config();
const { REST, Routes } = require('discord.js');
const path = require('path');
const fs = require('fs');
const logger = require('./src/utils/logger');

const commands = [];

function loadCommandsFromDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadCommandsFromDir(fullPath);
    } else if (entry.name.endsWith('.js')) {
      const cmd = require(fullPath);
      if (cmd.data) {
        commands.push(cmd.data.toJSON());
        logger.info(`Queued: ${cmd.data.name}`);
      }
    }
  }
}

loadCommandsFromDir(path.join(__dirname, 'src/commands'));

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    logger.info(`Registering ${commands.length} slash commands globally...`);
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    logger.info('All slash commands registered successfully!');
  } catch (err) {
    logger.error('Failed to register slash commands:', err);
    process.exit(1);
  }
})();
