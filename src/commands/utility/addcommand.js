const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcommand')
    .setDescription('Add a custom text command for this server')
    .addStringOption(opt => opt.setName('name').setDescription('Command trigger name').setRequired(true))
    .addStringOption(opt => opt.setName('response').setDescription('Response when triggered').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const name = interaction.options.getString('name').toLowerCase().replace(/\s+/g, '_');
    const response = interaction.options.getString('response');

    const reserved = [...client.commands.keys()];
    if (reserved.includes(name))
      return interaction.reply({ embeds: [errorEmbed(`\`${name}\` conflicts with a built-in command.`)], ephemeral: true });

    client.db.addCustomCommand(interaction.guild.id, name, response);
    await interaction.reply({ embeds: [successEmbed('Custom Command Added', `\`/${name}\` is now active.\n**Response:** ${response}`)] });
  },
};
