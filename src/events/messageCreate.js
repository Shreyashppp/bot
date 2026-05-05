module.exports = {
  eventName: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const guildData = client.db.getGuild(message.guild.id);
    const prefix = guildData.prefix || '.';

    if (!message.content.startsWith(prefix)) {
      const customCmd = client.db.getCustomCommand(message.guild.id, message.content.trim().split(' ')[0]);
      if (customCmd) await message.channel.send(customCmd.response).catch(() => {});
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
      await command.run(message, args, client);
    } catch (err) {
      console.error(err);
      await message.reply('❌ Something went wrong.').catch(() => {});
    }
  },
};
