module.exports = {
  eventName: 'guildBanAdd',
  async execute(ban, client) {
    const guild = client.db.getGuild(ban.guild.id);
    if (!guild.log_channel) return;
    const channel = ban.guild.channels.cache.get(guild.log_channel);
    if (!channel) return;
    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: 'User', value: `${ban.user.tag} (${ban.user.id})`, inline: true },
        { name: 'Reason', value: ban.reason || 'No reason provided', inline: true }
      )
      .setTimestamp();
    await channel.send({ embeds: [embed] }).catch(() => {});
  },
};
