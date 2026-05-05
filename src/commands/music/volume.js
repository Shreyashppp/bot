const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Show current volume (volume control requires resource inlineVolume)')
    .addIntegerOption(opt => opt.setName('level').setDescription('Volume level (1-100)').setMinValue(1).setMaxValue(100)),

  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guild.id);
    if (!queue || !queue.playing)
      return interaction.reply({ embeds: [errorEmbed('Nothing is playing.')], ephemeral: true });

    const level = interaction.options.getInteger('level');
    if (!level) {
      return interaction.reply({ embeds: [successEmbed('Volume', `Current volume: **${queue.volume}%**`)] });
    }

    queue.volume = level;
    await interaction.reply({ embeds: [successEmbed('Volume Updated', `Volume set to **${level}%**`)] });
  },
};
