const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "ping",
  category: "utility",

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription("Bot working perfectly")
      .setColor("Green");

    await interaction.reply({ embeds: [embed] });
  }
};
