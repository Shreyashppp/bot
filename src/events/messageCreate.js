const { handleAutomod } = require('./automodHandler');

const handled = new Set();

module.exports = {
  eventName: 'messageCreate',

  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    // Skip messages that were sent before this instance became ready.
    // This prevents Discord session replay from causing double-responses.
    const cutoff = (client.readyTimestamp || client.bootTime || 0) - 500;
    if (message.createdTimestamp < cutoff) {
      console.log(`[SKIP-OLD] message ${message.id} is from before bot ready — ignoring`);
      return;
    }

    // In-process dedup guard (catches any lingering double-fires)
    if (handled.has(message.id)) {
      console.warn(`[DUPLICATE] messageCreate fired twice for ${message.id} — blocked`);
      return;
    }
    handled.add(message.id);
    setTimeout(() => handled.delete(message.id), 10000);

    console.log(`[MSG] ${message.author.tag} in ${message.guild.name}: ${message.content.slice(0, 80)}`);

    await handleAutomod(message, client).catch(() => {});

    const guildData = client.db.getGuild(message.guild.id);
    const prefix = guildData.prefix || '.';

    if (!message.content.startsWith(prefix)) {
      const word = message.content.trim().split(/\s+/)[0].toLowerCase();
      const customCmd = client.db.getCustomCommand(message.guild.id, word);
      if (customCmd) await message.channel.send(customCmd.response).catch(() => {});
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    console.log(`[CMD] ${message.author.tag} → ${prefix}${commandName}`);

    try {
      await command.run(message, args, client);
    } catch (err) {
      console.error(`[CMD ERROR] ${commandName}:`, err.message);
      await message.reply('❌ Something went wrong.').catch(() => {});
    }
  },
};
