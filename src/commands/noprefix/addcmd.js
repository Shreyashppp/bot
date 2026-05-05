const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'addcmd',
  aliases: ['addcommand'],
  description: 'Add a custom command',
  usage: 'addcmd <name> <response>',
  data: new SlashCommandBuilder()
    .setName('addcmd')
    .setDescription('Add a custom command')
    .addStringOption(o => o.setName('name').setDescription('Command name').setRequired(true))
    .addStringOption(o => o.setName('response').setDescription('Response text').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const name = interaction.options.getString('name').toLowerCase();
    const response = interaction.options.getString('response');
    client.db.addCustomCommand(interaction.guild.id, name, response);
    return interaction.reply({ embeds: [successEmbed('Command Added', `Custom command \`${name}\` created.`)] });
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply('❌ Missing permissions.');
    const name = args[0]?.toLowerCase();
    const response = args.slice(1).join(' ');
    if (!name || !response) return message.reply('Usage: `.addcmd <name> <response>`');
    client.db.addCustomCommand(message.guild.id, name, response);
    return message.reply({ embeds: [successEmbed('Command Added', `\`${name}\` created.`)] });
  },
};
