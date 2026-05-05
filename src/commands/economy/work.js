const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const COOLDOWN = 60 * 60 * 1000;
const JOBS = [
  { job: 'programmer', min: 50, max: 150 },
  { job: 'chef', min: 30, max: 100 },
  { job: 'delivery driver', min: 20, max: 80 },
  { job: 'teacher', min: 40, max: 120 },
  { job: 'doctor', min: 80, max: 200 },
  { job: 'artist', min: 25, max: 90 },
  { job: 'musician', min: 30, max: 110 },
  { job: 'streamer', min: 10, max: 250 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to earn coins (1 hour cooldown)'),

  async execute(interaction, client) {
    const economy = client.db.getBalance(interaction.guild.id, interaction.user.id);
    const now = Date.now();
    const diff = now - economy.last_work;

    if (diff < COOLDOWN) {
      const remaining = COOLDOWN - diff;
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(COLORS.warning).setTitle('⏰ Too soon!').setDescription(`You're tired. Rest for **${minutes}m ${seconds}s** before working again.`)],
        ephemeral: true,
      });
    }

    const job = JOBS[Math.floor(Math.random() * JOBS.length)];
    const earned = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

    client.db.addBalance(interaction.guild.id, interaction.user.id, earned);
    client.db.setLastWork(interaction.guild.id, interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle('💼 Work Complete!')
      .setDescription(`You worked as a **${job.job}** and earned **${earned} 🪙 coins**!`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
