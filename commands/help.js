const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "help",

  async execute(interaction, client) {

    const commands = client.commands.map(cmd => `/${cmd.name}`).join("\n");

    const embed = new EmbedBuilder()
      .setTitle("📜 Commands")
      .setDescription(commands)
      .setColor("Blue")
      .setFooter({ text: "Auto Help System" });

    await interaction.reply({ embeds: [embed] });
  }
};
