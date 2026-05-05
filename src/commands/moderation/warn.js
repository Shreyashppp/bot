const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the warning').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [errorEmbed("You can't warn yourself.")], ephemeral: true });
    if (target.bot)
      return interaction.reply({ embeds: [errorEmbed("You can't warn a bot.")], ephemeral: true });

    client.db.addWarning(interaction.guild.id, target.id, interaction.user.id, reason);
    const warnings = client.db.getWarnings(interaction.guild.id, target.id);

    const embed = successEmbed('Warning Issued', `${target.tag} has been warned.`)
      .addFields(
        { name: 'Reason', value: reason },
        { name: 'Total Warnings', value: `${warnings.length}`, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true }
      );

    await interaction.reply({ embeds: [embed] });

    try {
      await target.send(`⚠️ You have been warned in **${interaction.guild.name}**.\n**Reason:** ${reason}`);
    } catch (_) {}
  },
};
