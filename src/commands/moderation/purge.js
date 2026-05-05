const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(opt => opt.setName('user').setDescription('Only delete messages from this user'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const amount = interaction.options.getInteger('amount');
    const filterUser = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    let toDelete = [...messages.values()].filter(m => {
      const notOld = Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000;
      const matchesUser = filterUser ? m.author.id === filterUser.id : true;
      return notOld && matchesUser;
    }).slice(0, amount);

    if (toDelete.length === 0)
      return interaction.editReply({ embeds: [errorEmbed('No eligible messages found to delete.')] });

    const deleted = await interaction.channel.bulkDelete(toDelete, true);
    await interaction.editReply({ embeds: [successEmbed('Messages Deleted', `Deleted **${deleted.size}** message(s)${filterUser ? ` from ${filterUser.tag}` : ''}.`)] });
  },
};
