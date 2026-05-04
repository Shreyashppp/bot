const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "ping",
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription("Bot is working perfectly")
      .setColor("Green")
      .setFooter({ text: "Your Bot" });

    await interaction.reply({ embeds: [embed] });
  }
};
