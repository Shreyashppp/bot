const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const MEDALS = ['🥇', '🥈', '🥉'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the richest members of the server'),

  async execute(interaction, client) {
    await interaction.deferReply();
    const top = client.db.getLeaderboard(interaction.guild.id, 10);

    if (!top.length)
      return interaction.editReply({ embeds: [new EmbedBuilder().setColor(COLORS.warning).setDescription('No economy data yet. Use `/work` or `/daily` to get started!')] });

    const entries = await Promise.all(top.map(async (row, i) => {
      const user = await client.users.fetch(row.user_id).catch(() => null);
      const name = user ? user.username : `Unknown (${row.user_id})`;
      const medal = MEDALS[i] || `${i + 1}.`;
      return `${medal} **${name}** — ${row.balance.toLocaleString()} 🪙`;
    }));

    const embed = new EmbedBuilder()
      .setColor(COLORS.economy)
      .setTitle('🏆 Economy Leaderboard')
      .setDescription(entries.join('\n'))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
