const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get information about a user')
    .addUserOption(opt => opt.setName('user').setDescription('User to look up (default: yourself)')),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(target.id);

    const warnings = client.db.getWarnings(interaction.guild.id, target.id);
    const economy = client.db.getBalance(interaction.guild.id, target.id);

    const roles = member
      ? member.roles.cache
          .filter(r => r.id !== interaction.guild.id)
          .sort((a, b) => b.position - a.position)
          .map(r => `${r}`)
          .slice(0, 10)
          .join(' ')
      : 'N/A';

    const embed = new EmbedBuilder()
      .setColor(member?.displayColor || COLORS.primary)
      .setTitle(`👤 ${target.tag}`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 User ID', value: target.id, inline: true },
        { name: '🤖 Bot', value: target.bot ? 'Yes' : 'No', inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`, inline: true },
      );

    if (member) {
      embed.addFields(
        { name: '📥 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: '⚠️ Warnings', value: `${warnings.length}`, inline: true },
        { name: '🪙 Balance', value: `${economy.balance.toLocaleString()}`, inline: true },
        { name: `🎭 Roles (${member.roles.cache.size - 1})`, value: roles || 'None' }
      );
    }

    embed.setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
