const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'unban',
  aliases: ['ub'],
  description: 'Unban a user by ID',
  usage: 'unban <userId> [reason]',
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by ID')
    .addStringOption(o => o.setName('userid').setDescription('User ID').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      const user = await client.users.fetch(userId);
      await interaction.guild.members.unban(userId, reason);
      await interaction.reply({ embeds: [successEmbed('Member Unbanned', `**${user.tag}** has been unbanned.`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not unban. User may not be banned or ID is invalid.')], ephemeral: true });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply('❌ Missing permissions.');
    const userId = args[0];
    if (!userId) return message.reply('❌ Provide a user ID.');
    try {
      const user = await client.users.fetch(userId);
      await message.guild.members.unban(userId);
      await message.reply({ embeds: [successEmbed('Member Unbanned', `**${user.tag}** has been unbanned.`)] });
    } catch {
      await message.reply('❌ Could not unban. Invalid ID or user is not banned.');
    }
  },
};
