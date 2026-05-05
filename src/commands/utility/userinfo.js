const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'userinfo',
  aliases: ['ui', 'whois'],
  description: 'View user information',
  usage: 'userinfo [user]',
  data: new SlashCommandBuilder().setName('userinfo').setDescription('View user information').addUserOption(o => o.setName('user').setDescription('User to check')),

  async execute(interaction, client) {
    const member = interaction.options.getMember('user') || interaction.member;
    const user = member.user;
    const warns = client.db.getWarnings(interaction.guild.id, user.id);
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle(user.tag)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Nickname', value: member.nickname || 'None', inline: true },
        { name: 'Warnings', value: `${warns.length}`, inline: true },
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roles', value: member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => `${r}`).join(', ').slice(0, 500) || 'None' }
      ).setFooter({ text: `ID: ${user.id}` }).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },

  async run(message, args, client) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const user = member.user;
    const warns = client.db.getWarnings(message.guild.id, user.id);
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle(user.tag)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Warnings', value: `${warns.length}`, inline: true },
        { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
      );
    await message.reply({ embeds: [embed] });
  },
};
