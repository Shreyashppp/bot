module.exports = {
  eventName: 'messageDelete',
  async execute(message, client) {
    if (!message.guild || message.author?.bot) return;
    if (message.content) {
      client.db.setSnipe(message.channel.id, message.guild.id, message.author?.id, message.author?.tag, message.content);
    }
    const guild = client.db.getGuild(message.guild.id);
    if (!guild.log_channel) return;
    const logChannel = message.guild.channels.cache.get(guild.log_channel);
    if (!logChannel) return;
    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🗑️ Message Deleted')
      .addFields(
        { name: 'Author', value: `${message.author?.tag || 'Unknown'} (${message.author?.id || 'Unknown'})`, inline: true },
        { name: 'Channel', value: `${message.channel}`, inline: true },
        { name: 'Content', value: message.content?.slice(0, 1024) || '*No text content*' }
      )
      .setTimestamp();
    await logChannel.send({ embeds: [embed] }).catch(() => {});
  },
};
