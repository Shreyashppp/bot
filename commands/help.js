const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "help",

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle("📜 Commands")
      .setColor("Blue")
      .addFields(
        { name: "/ping", value: "Check bot status", inline: true },
        { name: "/help", value: "Show commands", inline: true },
        { name: "/ban", value: "Ban a user", inline: true },
        { name: "/kick", value: "Kick a user", inline: true },
        { name: "/mute", value: "Mute a user", inline: true }
      )
      .setFooter({ text: "Made with ❤️" });

    await interaction.reply({ embeds: [embed] });
  }
};
