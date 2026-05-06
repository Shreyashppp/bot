const { handleAutomod } = require('./automodHandler');

const processed = new Set();

module.exports = {
  eventName: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    if (processed.has(message.id)) {
      console.warn(`[DUPLICATE] messageCreate fired twice for ${message.id} — blocking second execution`);
      return;
    }
    processed.add(message.id);
    setTimeout(() => processed.delete(message.id), 5000);

    await handleAutomod(message, client).catch(() => {});

    const guildData = client.db.getGuild(message.guild.id);
    const prefix = guildData.prefix || '.';

    if (!message.content.startsWith(prefix)) {
      const customCmd = client.db.getCustomCommand(
        message.guild.id,
        message.content.trim().split(' ')[0].toLowerCase()
      );
      if (customCmd) await message.channel.send(customCmd.response).catch(() => {});
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    console.log(`[CMD] ${message.author.tag} → ${prefix}${commandName} in ${message.guild.name}`);

    try {
      await command.run(message, args, client);
    } catch (err) {
      console.error(`[CMD ERROR] ${commandName}:`, err);
      await message.reply('❌ Something went wrong.').catch(() => {});
    }
  },
};
