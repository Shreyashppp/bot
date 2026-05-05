const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music and clear the queue'),

  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guild.id);
    if (!queue || !queue.playing)
      return interaction.reply({ embeds: [errorEmbed('Nothing is playing right now.')], ephemeral: true });
    if (!interaction.member.voice.channel)
      return interaction.reply({ embeds: [errorEmbed('You must be in a voice channel.')], ephemeral: true });

    queue.stop();
    client.queues.delete(interaction.guild.id);
    await interaction.reply({ embeds: [successEmbed('Stopped', 'Music stopped and queue cleared.')] });
  },
};
