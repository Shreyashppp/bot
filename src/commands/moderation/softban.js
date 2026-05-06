const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'softban',
  aliases: ['sb'],
  description: 'Softban a member (ban + immediate unban to delete messages)',
  usage: 'softban <user> [reason]',
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Softban a member (kick and delete messages)')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      await interaction.guild.members.ban(target.id, { reason, deleteMessageSeconds: 604800 });
      await interaction.guild.members.unban(target.id, 'Softban');
      await interaction.reply({ embeds: [successEmbed('Member Softbanned', `**${target.tag}** has been softbanned.\n**Reason:** ${reason}`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not softban that user.')], flags: 64 });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply('❌ Missing permissions.');
    const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
    if (!target) return message.reply('❌ Provide a valid user.');
    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      await message.guild.members.ban(target.id, { reason, deleteMessageSeconds: 604800 });
      await message.guild.members.unban(target.id, 'Softban');
      await message.reply({ embeds: [successEmbed('Member Softbanned', `**${target.tag}** softbanned.`)] });
    } catch {
      await message.reply('❌ Could not softban that user.');
    }
  },
};
