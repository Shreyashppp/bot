const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'setprefix',
  aliases: ['prefix'],
  description: 'Change the bot prefix for this server',
  usage: 'setprefix <prefix>',
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Change the bot prefix for this server')
    .addStringOption(o => o.setName('prefix').setDescription('New prefix').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const prefix = interaction.options.getString('prefix');
    if (prefix.length > 5) return interaction.reply({ embeds: [errorEmbed('Prefix must be 5 characters or less.')], ephemeral: true });
    client.db.setPrefix(interaction.guild.id, prefix);
    return interaction.reply({ embeds: [successEmbed('Prefix Updated', `Server prefix set to \`${prefix}\`.`)] });
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply('❌ Missing permissions.');
    const prefix = args[0];
    if (!prefix || prefix.length > 5) return message.reply('❌ Provide a valid prefix (max 5 chars).');
    client.db.setPrefix(message.guild.id, prefix);
    return message.reply({ embeds: [successEmbed('Prefix Updated', `Server prefix set to \`${prefix}\`.`)] });
  },
};
