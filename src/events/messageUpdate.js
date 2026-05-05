module.exports = {
  eventName: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;
    const guild = client.db.getGuild(oldMessage.guild.id);
    if (!guild.log_channel) return;
    const logChannel = oldMessage.guild.channels.cache.get(guild.log_channel);
    if (!logChannel) return;
    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle('✏️ Message Edited')
      .addFields(
        { name: 'Author', value: `${oldMessage.author?.tag} (${oldMessage.author?.id})`, inline: true },
        { name: 'Channel', value: `${oldMessage.channel}`, inline: true },
        { name: 'Before', value: oldMessage.content?.slice(0, 512) || '*empty*' },
        { name: 'After', value: newMessage.content?.slice(0, 512) || '*empty*' }
      )
      .setTimestamp();
    await logChannel.send({ embeds: [embed] }).catch(() => {});
  },
};
