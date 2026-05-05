const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'clearwarnings',
  aliases: ['clearwarns', 'cw'],
  description: 'Clear all warnings for a member',
  usage: 'clearwarnings <user>',
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear all warnings for a member')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    client.db.clearWarnings(interaction.guild.id, target.id);
    await interaction.reply({ embeds: [successEmbed('Warnings Cleared', `All warnings for **${target.tag}** have been cleared.`)] });
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply('❌ Missing permissions.');
    const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
    if (!target) return message.reply('❌ Provide a valid user.');
    client.db.clearWarnings(message.guild.id, target.id);
    await message.reply({ embeds: [successEmbed('Warnings Cleared', `All warnings for **${target.tag}** cleared.`)] });
  },
};
