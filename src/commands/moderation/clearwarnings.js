const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear all warnings for a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to clear warnings for').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const result = client.db.clearWarnings(interaction.guild.id, target.id);

    if (result.changes === 0)
      return interaction.reply({ embeds: [errorEmbed(`${target.tag} has no warnings to clear.`)], ephemeral: true });

    await interaction.reply({ embeds: [successEmbed('Warnings Cleared', `Cleared **${result.changes}** warning(s) from ${target.tag}.`)] });
  },
};
