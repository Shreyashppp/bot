const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'delwarn',
  aliases: ['dw', 'removewarn'],
  description: 'Delete a specific warning by ID',
  usage: 'delwarn <id>',
  data: new SlashCommandBuilder()
    .setName('delwarn')
    .setDescription('Delete a specific warning by ID')
    .addIntegerOption(o => o.setName('id').setDescription('Warning ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const id = interaction.options.getInteger('id');
    client.db.deleteWarning(id);
    await interaction.reply({ embeds: [successEmbed('Warning Deleted', `Warning **#${id}** has been deleted.`)] });
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply('❌ Missing permissions.');
    const id = parseInt(args[0]);
    if (!id) return message.reply('❌ Provide a valid warning ID.');
    client.db.deleteWarning(id);
    await message.reply({ embeds: [successEmbed('Warning Deleted', `Warning **#${id}** deleted.`)] });
  },
};
