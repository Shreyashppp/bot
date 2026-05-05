const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../utils/embeds');

module.exports = {
  async execute(member, client) {
    const guild = member.guild;
    const settings = client.db.getGuild(guild.id);

    if (settings.log_channel) {
      const logChannel = guild.channels.cache.get(settings.log_channel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor(COLORS.error)
        .setTitle('📤 Member Left')
        .setDescription(`${member.user.tag} (${member.id})`)
        .addFields(
          { name: 'Joined', value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true },
          { name: 'Member Count', value: `${guild.memberCount}`, inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      logChannel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
