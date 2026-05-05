const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const COOLDOWN = 24 * 60 * 60 * 1000;
const DAILY_AMOUNT = 200;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily coins'),

  async execute(interaction, client) {
    const economy = client.db.getBalance(interaction.guild.id, interaction.user.id);
    const now = Date.now();
    const diff = now - economy.last_daily;

    if (diff < COOLDOWN) {
      const remaining = COOLDOWN - diff;
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);

      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COLORS.warning)
          .setTitle('⏰ Already Claimed')
          .setDescription(`You've already claimed your daily reward. Come back in **${hours}h ${minutes}m**.`)],
        ephemeral: true,
      });
    }

    client.db.addBalance(interaction.guild.id, interaction.user.id, DAILY_AMOUNT);
    client.db.setLastDaily(interaction.guild.id, interaction.user.id);
    const updated = client.db.getBalance(interaction.guild.id, interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle('🎁 Daily Reward Claimed!')
      .setDescription(`You received **${DAILY_AMOUNT} 🪙 coins**!`)
      .addFields({ name: 'New Balance', value: `**${updated.balance.toLocaleString()} 🪙**` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
