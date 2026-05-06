require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { loadCommands } = require('./src/handlers/commands');
const { loadEvents } = require('./src/handlers/events');
const logger = require('./src/utils/logger');
const Database = require('./src/utils/database');

const LOCK_FILE = path.join(__dirname, '.bot.lock');

function acquireLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const oldPid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim(), 10);
      if (oldPid && oldPid !== process.pid) {
        try {
          process.kill(oldPid, 0);
          logger.warn(`Killing old instance PID ${oldPid}...`);
          process.kill(oldPid, 'SIGTERM');
          setTimeout(() => { try { process.kill(oldPid, 'SIGKILL'); } catch {} }, 3000);
        } catch {
          logger.info(`Old instance PID ${oldPid} already dead.`);
        }
      }
    }
    fs.writeFileSync(LOCK_FILE, String(process.pid));
    logger.info(`[BOOT] Bot instance started — PID ${process.pid}`);
  } catch (err) {
    logger.error('Lock error:', err);
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const pid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim(), 10);
      if (pid === process.pid) fs.unlinkSync(LOCK_FILE);
    }
  } catch {}
}

acquireLock();
process.on('exit', releaseLock);
process.on('SIGTERM', () => { releaseLock(); process.exit(0); });
process.on('SIGINT',  () => { releaseLock(); process.exit(0); });

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

  logger.info('[BOOT] Waiting 4s for old instance to fully disconnect from Discord...');
  await new Promise(r => setTimeout(r, 4000));

  logger.info('[BOOT] Logging in...');
  await client.login(token);
})();

process.on('unhandledRejection', (err) => logger.error('Unhandled rejection:', err));
process.on('uncaughtException',  (err) => logger.error('Uncaught exception:', err));
