const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { successEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'smartmod',
  aliases: ['sm2'],
  description: 'Configure Smart Moderation (auto-punish on warn thresholds)',
  usage: 'smartmod <enable|disable|status|set>',
  data: new SlashCommandBuilder()
    .setName('smartmod')
    .setDescription('Configure Smart Moderation')
    .addSubcommand(s => s.setName('enable').setDescription('Enable smart mod'))
    .addSubcommand(s => s.setName('disable').setDescription('Disable smart mod'))
    .addSubcommand(s => s.setName('status').setDescription('View thresholds'))
    .addSubcommand(s => s.setName('set')
      .setDescription('Set thresholds')
      .addStringOption(o => o.setName('type').setDescription('Threshold type').setRequired(true).addChoices({ name: 'Mute At (warns)', value: 'mute_at' }, { name: 'Kick At (warns)', value: 'kick_at' }, { name: 'Ban At (warns)', value: 'ban_at' }))
      .addIntegerOption(o => o.setName('value').setDescription('Number of warnings').setRequired(true).setMinValue(1)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    if (sub === 'enable') { client.db.setSmartmod(guildId, 'enabled', 1); return interaction.reply({ embeds: [successEmbed('Smart Mod Enabled', '🧠 Smart Moderation is now **enabled**.')] }); }
    if (sub === 'disable') { client.db.setSmartmod(guildId, 'enabled', 0); return interaction.reply({ embeds: [successEmbed('Smart Mod Disabled', '🧠 Smart Moderation is now **disabled**.')] }); }
    if (sub === 'status') {
      const sm = client.db.getSmartmod(guildId);
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🧠 Smart Mod Settings').addFields(
        { name: 'Status', value: sm.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
        { name: 'Mute At', value: `${sm.mute_at} warns`, inline: true },
        { name: 'Kick At', value: `${sm.kick_at} warns`, inline: true },
        { name: 'Ban At', value: `${sm.ban_at} warns`, inline: true }
      )] });
    }
    if (sub === 'set') {
      const type = interaction.options.getString('type');
      const val = interaction.options.getInteger('value');
      client.db.setSmartmod(guildId, type, val);
      return interaction.reply({ embeds: [successEmbed('Smart Mod Updated', `**${type.replace(/_/g, ' ')}** set to **${val}**.`)] });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply('❌ Missing permissions.');
    const sub = args[0]?.toLowerCase();
    const guildId = message.guild.id;
    if (sub === 'enable') { client.db.setSmartmod(guildId, 'enabled', 1); return message.reply({ embeds: [successEmbed('Smart Mod Enabled', '🧠 Enabled.')] }); }
    if (sub === 'disable') { client.db.setSmartmod(guildId, 'enabled', 0); return message.reply({ embeds: [successEmbed('Smart Mod Disabled', '🧠 Disabled.')] }); }
    const sm = client.db.getSmartmod(guildId);
    return message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🧠 Smart Mod').setDescription(`**Status:** ${sm.enabled ? '✅' : '❌'}\n**Mute At:** ${sm.mute_at} warns\n**Kick At:** ${sm.kick_at} warns\n**Ban At:** ${sm.ban_at} warns`)] });
  },
};
