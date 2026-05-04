const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "help",
  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle("📜 Commands")
      .setColor("Blue")
      .addFields(
        { name: "/ping", value: "Check bot status", inline: true },
        { name: "/help", value: "Show commands", inline: true }
      )
      .setFooter({ text: "Made with ❤️" });

    await interaction.reply({ embeds: [embed] });
  }
};
