const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the currently playing song'),

  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guild.id);
    if (!queue || !queue.currentTrack)
      return interaction.reply({ embeds: [errorEmbed('Nothing is playing right now.')], ephemeral: true });

    const track = queue.currentTrack;
    const embed = new EmbedBuilder()
      .setColor(COLORS.music)
      .setTitle('🎵 Now Playing')
      .setDescription(`**[${track.title}](${track.url})**`)
      .addFields(
        { name: 'Duration', value: track.duration, inline: true },
        { name: 'Requested by', value: track.requester, inline: true },
        { name: 'Loop', value: queue.loop ? '✅ On' : '❌ Off', inline: true }
      )
      .setThumbnail(track.thumbnail)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
