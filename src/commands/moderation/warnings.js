const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'warnings',
  aliases: ['warns'],
  description: 'View warnings for a member',
  usage: 'warnings <user>',
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a member')
    .addUserOption(o => o.setName('user').setDescription('User to check').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const warns = client.db.getWarnings(interaction.guild.id, target.id);
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle(`⚠️ Warnings — ${target.tag}`)
      .setDescription(warns.length ? warns.map((w, i) => `**#${w.id}** — ${w.reason}\n<@${w.mod_id}> • <t:${Math.floor(w.timestamp / 1000)}:R>`).join('\n\n') : 'No warnings.')
      .setFooter({ text: `Total: ${warns.length}` });
    await interaction.reply({ embeds: [embed] });
  },

  async run(message, args, client) {
    const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
    if (!target) return message.reply('❌ Provide a valid user.');
    const warns = client.db.getWarnings(message.guild.id, target.id);
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle(`⚠️ Warnings — ${target.tag}`)
      .setDescription(warns.length ? warns.map(w => `**#${w.id}** — ${w.reason}\n<@${w.mod_id}> • <t:${Math.floor(w.timestamp / 1000)}:R>`).join('\n\n') : 'No warnings.')
      .setFooter({ text: `Total: ${warns.length}` });
    await message.reply({ embeds: [embed] });
  },
};
