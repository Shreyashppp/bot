require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { loadCommands } = require('./src/handlers/commands');
const { loadEvents } = require('./src/handlers/events');
const logger = require('./src/utils/logger');
const Database = require('./src/utils/database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.commands = new Collection();
client.prefixCommands = new Collection();
client.db = new Database();
client.bootTime = Date.now();

(async () => {
  await loadCommands(client);
  await loadEvents(client);

  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    logger.error('DISCORD_TOKEN is not set.');
    process.exit(1);
  }

  logger.info('Logging in...');
  await client.login(token);
})();

process.on('unhandledRejection', (err) => logger.error('Unhandled rejection:', err));
process.on('uncaughtException', (err) => logger.error('Uncaught exception:', err));