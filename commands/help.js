const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
  name: "help",

  async execute(interaction) {

    // MAIN MENU EMBED
    const embed = new EmbedBuilder()
      .setTitle("🤖 Help Menu")
      .setDescription("Select a category from the dropdown below")
      .addFields(
        { name: "🛡️ Moderation", value: "Ban, Kick, Mute", inline: true },
        { name: "⚙️ Utility", value: "Ping, Help", inline: true }
      )
      .setColor("Blue");

    // DROPDOWN MENU
    const menu = new StringSelectMenuBuilder()
      .setCustomId("help-menu")
      .setPlaceholder("Select a category")
      .addOptions([
        {
          label: "Moderation",
          description: "View moderation commands",
          value: "moderation"
        },
        {
          label: "Utility",
          description: "View utility commands",
          value: "utility"
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
