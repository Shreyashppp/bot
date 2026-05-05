const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../utils/embeds');

module.exports = {
  async execute(member, client) {
    const guild = member.guild;
    const settings = client.db.getGuild(guild.id);

    if (settings.autorole) {
      const role = guild.roles.cache.get(settings.autorole);
      if (role) member.roles.add(role).catch(() => {});
    }

    if (settings.welcome_channel) {
      const channel = guild.channels.cache.get(settings.welcome_channel);
      if (!channel) return;

      const message = (settings.welcome_message || 'Welcome {user} to **{server}**!')
        .replace('{user}', `<@${member.id}>`)
        .replace('{server}', guild.name)
        .replace('{username}', member.user.username)
        .replace('{membercount}', guild.memberCount);

      const embed = new EmbedBuilder()
        .setColor(COLORS.success)
        .setTitle('👋 Welcome!')
        .setDescription(message)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: 'Member #', value: `${guild.memberCount}`, inline: true })
        .setTimestamp();

      channel.send({ embeds: [embed] }).catch(() => {});
    }

    if (settings.log_channel) {
      const logChannel = guild.channels.cache.get(settings.log_channel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor(COLORS.success)
        .setTitle('📥 Member Joined')
        .setDescription(`${member} (${member.user.tag})`)
        .addFields(
          { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Member Count', value: `${guild.memberCount}`, inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      logChannel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
