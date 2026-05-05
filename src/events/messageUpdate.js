const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../utils/embeds');

module.exports = {
  async execute(oldMessage, newMessage, client) {
    if (!newMessage.guild || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;
    const settings = client.db.getGuild(newMessage.guild.id);
    if (!settings.log_channel) return;

    const logChannel = newMessage.guild.channels.cache.get(settings.log_channel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor(COLORS.info)
      .setTitle('✏️ Message Edited')
      .setURL(newMessage.url)
      .addFields(
        { name: 'Author', value: `${newMessage.author.tag}`, inline: true },
        { name: 'Channel', value: `<#${newMessage.channelId}>`, inline: true },
        { name: 'Before', value: oldMessage.content?.slice(0, 500) || '*Unknown*' },
        { name: 'After', value: newMessage.content?.slice(0, 500) || '*Empty*' }
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => {});
  },
};
