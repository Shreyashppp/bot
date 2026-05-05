const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll a dice')
    .addIntegerOption(opt => opt.setName('sides').setDescription('Number of sides (default: 6)').setMinValue(2).setMaxValue(1000))
    .addIntegerOption(opt => opt.setName('count').setDescription('Number of dice to roll (default: 1)').setMinValue(1).setMaxValue(10)),

  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? 6;
    const count = interaction.options.getInteger('count') ?? 1;

    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('🎲 Dice Roll')
      .addFields(
        { name: 'Rolls', value: rolls.map(r => `\`${r}\``).join(' + ') },
        { name: 'Total', value: `**${total}**`, inline: true },
        { name: 'Dice', value: `${count}d${sides}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
