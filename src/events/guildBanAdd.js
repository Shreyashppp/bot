const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../utils/embeds');

module.exports = {
  async execute(ban, client) {
    const settings = client.db.getGuild(ban.guild.id);
    if (!settings.log_channel) return;

    const logChannel = ban.guild.channels.cache.get(settings.log_channel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor(COLORS.error)
      .setTitle('🔨 Member Banned')
      .setDescription(`${ban.user.tag} (${ban.user.id})`)
      .addFields({ name: 'Reason', value: ban.reason || 'No reason provided' })
      .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => {});
  },
};
