const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: "purge",
  category: "moderation",

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({ content: "No permission", ephemeral: true });

    const amount = interaction.options.getInteger('amount');

    if (!amount || amount < 1 || amount > 100)
      return interaction.reply({ content: "1-100 only", ephemeral: true });

    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply(`Deleted ${amount} messages`);
  }
};
