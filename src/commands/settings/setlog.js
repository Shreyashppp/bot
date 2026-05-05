const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlog')
    .setDescription('Set the channel for server logs')
    .addChannelOption(opt => opt.setName('channel').setDescription('Log channel (leave empty to disable)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');

    if (!channel) {
      client.db.setLogChannel(interaction.guild.id, null);
      return interaction.reply({ embeds: [successEmbed('Logging Disabled', 'Server logging has been turned off.')] });
    }

    if (!channel.isTextBased())
      return interaction.reply({ embeds: [errorEmbed('Please select a text channel.')], ephemeral: true });

    client.db.setLogChannel(interaction.guild.id, channel.id);
    await interaction.reply({ embeds: [successEmbed('Log Channel Set', `Server logs will be sent to ${channel}.`)] });
  },
};
