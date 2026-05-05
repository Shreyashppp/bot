const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin'),

  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const emoji = result === 'Heads' ? '🪙' : '💿';

    const embed = new EmbedBuilder()
      .setColor(COLORS.economy)
      .setTitle(`${emoji} Coin Flip`)
      .setDescription(`The coin landed on **${result}**!`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
