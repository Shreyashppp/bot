const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../utils/embeds');

module.exports = {
  async execute(message, client) {
    if (!message.guild || message.author?.bot) return;
    const settings = client.db.getGuild(message.guild.id);
    if (!settings.log_channel) return;

    const logChannel = message.guild.channels.cache.get(settings.log_channel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor(COLORS.warning)
      .setTitle('🗑️ Message Deleted')
      .addFields(
        { name: 'Author', value: message.author ? `${message.author.tag}` : 'Unknown', inline: true },
        { name: 'Channel', value: `<#${message.channelId}>`, inline: true },
        { name: 'Content', value: message.content ? message.content.slice(0, 1000) : '*No content*' }
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => {});
  },
};
