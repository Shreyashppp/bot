const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'serverinfo',
  aliases: ['si', 'server'],
  description: 'View server information',
  usage: 'serverinfo',
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('View server information'),

  async execute(interaction, client) {
    const g = interaction.guild;
    await g.members.fetch();
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle(`${g.name}`)
      .setThumbnail(g.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Owner', value: `<@${g.ownerId}>`, inline: true },
        { name: 'Members', value: `${g.memberCount}`, inline: true },
        { name: 'Channels', value: `${g.channels.cache.size}`, inline: true },
        { name: 'Roles', value: `${g.roles.cache.size}`, inline: true },
        { name: 'Boosts', value: `${g.premiumSubscriptionCount}`, inline: true },
        { name: 'Boost Level', value: `Level ${g.premiumTier}`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Verification', value: g.verificationLevel.toString(), inline: true },
        { name: 'ID', value: g.id, inline: true }
      ).setFooter({ text: `ID: ${g.id}` }).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },

  async run(message, args, client) {
    const g = message.guild;
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle(g.name)
      .setThumbnail(g.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Owner', value: `<@${g.ownerId}>`, inline: true },
        { name: 'Members', value: `${g.memberCount}`, inline: true },
        { name: 'Channels', value: `${g.channels.cache.size}`, inline: true },
        { name: 'Roles', value: `${g.roles.cache.size}`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true }
      );
    await message.reply({ embeds: [embed] });
  },
};
