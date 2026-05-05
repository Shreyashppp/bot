const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Transfer coins to another user')
    .addUserOption(opt => opt.setName('user').setDescription('User to pay').setRequired(true))
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to transfer').setRequired(true).setMinValue(1)),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [errorEmbed("You can't pay yourself.")], ephemeral: true });
    if (target.bot)
      return interaction.reply({ embeds: [errorEmbed("You can't pay a bot.")], ephemeral: true });

    const sender = client.db.getBalance(interaction.guild.id, interaction.user.id);
    if (sender.balance < amount)
      return interaction.reply({ embeds: [errorEmbed(`You only have **${sender.balance} 🪙**. You need **${amount} 🪙**.`)], ephemeral: true });

    client.db.transferBalance(interaction.guild.id, interaction.user.id, target.id, amount);

    await interaction.reply({
      embeds: [successEmbed('Transfer Complete', `**${interaction.user.username}** sent **${amount} 🪙** to **${target.username}**.`)],
    });
  },
};
