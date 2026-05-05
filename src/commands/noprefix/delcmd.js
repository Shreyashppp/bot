const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'delcmd',
  aliases: ['delcommand', 'removecommand'],
  description: 'Delete a custom command',
  usage: 'delcmd <name>',
  data: new SlashCommandBuilder()
    .setName('delcmd')
    .setDescription('Delete a custom command')
    .addStringOption(o => o.setName('name').setDescription('Command name').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const name = interaction.options.getString('name').toLowerCase();
    client.db.deleteCustomCommand(interaction.guild.id, name);
    return interaction.reply({ embeds: [successEmbed('Command Deleted', `Custom command \`${name}\` deleted.`)] });
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply('❌ Missing permissions.');
    const name = args[0]?.toLowerCase();
    if (!name) return message.reply('Usage: `.delcmd <name>`');
    client.db.deleteCustomCommand(message.guild.id, name);
    return message.reply({ embeds: [successEmbed('Command Deleted', `\`${name}\` deleted.`)] });
  },
};
