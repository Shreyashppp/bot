const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Toggle loop for the current song'),

  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guild.id);
    if (!queue || !queue.playing)
      return interaction.reply({ embeds: [errorEmbed('Nothing is playing.')], ephemeral: true });

    const looping = queue.toggleLoop();
    await interaction.reply({ embeds: [successEmbed('Loop Updated', `Loop is now **${looping ? 'enabled ✅' : 'disabled ❌'}**.`)] });
  },
};
