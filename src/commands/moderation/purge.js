const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'purge',
  aliases: ['clear', 'prune'],
  description: 'Bulk delete messages',
  usage: 'purge <amount> [user]',
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('user').setDescription('Only delete messages from this user'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const amount = interaction.options.getInteger('amount');
    const user = interaction.options.getUser('user');
    await interaction.deferReply({ flags: 64 });
    let messages = await interaction.channel.messages.fetch({ limit: 100 });
    if (user) messages = messages.filter(m => m.author.id === user.id);
    messages = [...messages.values()].slice(0, amount);
    const deleted = await interaction.channel.bulkDelete(messages, true).catch(() => null);
    await interaction.editReply({ embeds: [successEmbed('Messages Purged', `Deleted **${deleted?.size || 0}** message(s).`)] });
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply('❌ Missing permissions.');
    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) return message.reply('❌ Provide a number between 1 and 100.');
    const user = message.mentions.users.first();
    let msgs = await message.channel.messages.fetch({ limit: 100 });
    if (user) msgs = msgs.filter(m => m.author.id === user.id);
    msgs = [...msgs.values()].slice(0, amount);
    const deleted = await message.channel.bulkDelete(msgs, true).catch(() => null);
    const reply = await message.channel.send({ embeds: [successEmbed('Messages Purged', `Deleted **${deleted?.size || 0}** message(s).`)] });
    setTimeout(() => reply.delete().catch(() => {}), 3000);
  },
};
