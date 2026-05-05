module.exports = {
  eventName: 'guildMemberAdd',
  async execute(member, client) {
    const autoroles = client.db.getAutoroles(member.guild.id);
    for (const row of autoroles) {
      if (row.type === 'all' || (row.type === 'bot' && member.user.bot) || (row.type === 'human' && !member.user.bot)) {
        await member.roles.add(row.role_id).catch(() => {});
      }
    }

    const welcomer = client.db.getWelcomer(member.guild.id);
    if (!welcomer.welcome_enabled || !welcomer.welcome_channel) return;
    const channel = member.guild.channels.cache.get(welcomer.welcome_channel);
    if (!channel) return;

    const msg = (welcomer.welcome_message || 'Welcome {user} to **{server}**!')
      .replace(/{user}/g, `${member}`)
      .replace(/{username}/g, member.user.username)
      .replace(/{server}/g, member.guild.name)
      .replace(/{membercount}/g, member.guild.memberCount);

    if (welcomer.welcome_embed) {
      const { EmbedBuilder } = require('discord.js');
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setDescription(msg)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Member #${member.guild.memberCount}` })
        .setTimestamp();
      await channel.send({ embeds: [embed] }).catch(() => {});
    } else {
      await channel.send(msg).catch(() => {});
    }
  },
};
