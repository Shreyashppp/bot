const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current song'),

  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guild.id);
    if (!queue || !queue.playing)
      return interaction.reply({ embeds: [errorEmbed('Nothing is playing.')], ephemeral: true });

    const paused = queue.pause();
    if (!paused)
      return interaction.reply({ embeds: [errorEmbed('Could not pause — already paused?')], ephemeral: true });

    await interaction.reply({ embeds: [successEmbed('Paused', 'Music has been paused. Use `/resume` to continue.')] });
  },
};
