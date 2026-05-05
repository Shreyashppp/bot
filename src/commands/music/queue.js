const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the current music queue'),

  async execute(interaction, client) {
    const queue = client.queues.get(interaction.guild.id);
    if (!queue || !queue.playing)
      return interaction.reply({ embeds: [errorEmbed('Nothing is playing right now.')], ephemeral: true });

    const upcoming = queue.tracks.slice(0, 10).map((t, i) => `**${i + 1}.** [${t.title}](${t.url}) — ${t.duration}`).join('\n') || 'Queue is empty.';

    const embed = new EmbedBuilder()
      .setColor(COLORS.music)
      .setTitle('🎵 Music Queue')
      .addFields(
        { name: 'Now Playing', value: queue.currentTrack ? `[${queue.currentTrack.title}](${queue.currentTrack.url})` : 'Nothing' },
        { name: `Up Next (${queue.tracks.length} tracks)`, value: upcoming }
      )
      .addFields(
        { name: 'Loop', value: queue.loop ? '✅ On' : '❌ Off', inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
