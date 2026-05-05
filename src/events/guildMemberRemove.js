module.exports = {
  eventName: 'guildMemberRemove',
  async execute(member, client) {
    const welcomer = client.db.getWelcomer(member.guild.id);
    if (!welcomer.leave_enabled || !welcomer.leave_channel) return;
    const channel = member.guild.channels.cache.get(welcomer.leave_channel);
    if (!channel) return;

    const msg = (welcomer.leave_message || 'Goodbye **{username}**, we will miss you!')
      .replace(/{user}/g, `${member}`)
      .replace(/{username}/g, member.user.username)
      .replace(/{server}/g, member.guild.name)
      .replace(/{membercount}/g, member.guild.memberCount);

    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
      .setColor(0x95a5a6)
      .setDescription(msg)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Member #${member.guild.memberCount}` })
      .setTimestamp();
    await channel.send({ embeds: [embed] }).catch(() => {});
  },
};
