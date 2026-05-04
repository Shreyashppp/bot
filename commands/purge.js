const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: "purge",

  async execute(interaction) {

    // Permission check
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ You don't have permission",
        ephemeral: true
      });
    }

    const amount = interaction.options.getInteger('amount');

    if (!amount || amount < 1 || amount > 100) {
      return interaction.reply({
        content: "❌ Enter a number between 1 and 100",
        ephemeral: true
      });
    }

    // Delete messages
    await interaction.channel.bulkDelete(amount, true);

    const embed = new EmbedBuilder()
      .setTitle("🧹 Purge Complete")
      .setDescription(`Deleted ${amount} messages`)
      .setColor("Green");

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
