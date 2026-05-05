const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume paused music'),

  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guild.id);
    if (!queue || !queue.playing)
      return interaction.reply({ embeds: [errorEmbed('Nothing is paused.')], ephemeral: true });

    const resumed = queue.resume();
    if (!resumed)
      return interaction.reply({ embeds: [errorEmbed('Could not resume — music is already playing.')], ephemeral: true });

    await interaction.reply({ embeds: [successEmbed('Resumed', 'Music has been resumed.')] });
  },
};
