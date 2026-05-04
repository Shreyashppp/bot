const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete multiple messages in bulk (1-100) from the current channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Number of messages to delete')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  category: 'moderation',

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount', true);

    if (!interaction.channel || !interaction.channel.isTextBased() || !interaction.channel.bulkDelete) {
      await interaction.reply({
        content: 'This command can only be used in a text channel.',
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const deletedMessages = await interaction.channel.bulkDelete(amount, true);

    if (!deletedMessages.size) {
      await interaction.editReply({
        content: 'No messages were deleted. Messages older than 14 days cannot be purged in bulk.'
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('🧹 Channel Purged')
      .setDescription(
        `Deleted **${deletedMessages.size}** message(s) from <#${interaction.channel.id}>.`
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed], content: null });
  }
};
