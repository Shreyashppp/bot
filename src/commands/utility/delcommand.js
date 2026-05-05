const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delcommand')
    .setDescription('Delete a custom command from this server')
    .addStringOption(opt => opt.setName('name').setDescription('Command name to delete').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const name = interaction.options.getString('name').toLowerCase();
    const result = client.db.deleteCustomCommand(interaction.guild.id, name);

    if (result.changes === 0)
      return interaction.reply({ embeds: [errorEmbed(`No custom command named \`${name}\` found.`)], ephemeral: true });

    await interaction.reply({ embeds: [successEmbed('Command Deleted', `The custom command \`${name}\` has been removed.`)] });
  },
};
