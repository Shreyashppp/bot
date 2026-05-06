const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'automod',
  aliases: ['am'],
  description: 'Manage Auto-Mod settings',
  usage: 'automod <enable|disable|status|badword|spam|links|caps|invites|action>',
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Manage Auto-Mod settings')
    .addSubcommand(s => s.setName('enable').setDescription('Enable auto-mod'))
    .addSubcommand(s => s.setName('disable').setDescription('Disable auto-mod'))
    .addSubcommand(s => s.setName('status').setDescription('View current settings'))
    .addSubcommand(s => s.setName('badword')
      .setDescription('Manage bad words')
      .addStringOption(o => o.setName('action').setDescription('add/remove/list').setRequired(true).addChoices({ name: 'add', value: 'add' }, { name: 'remove', value: 'remove' }, { name: 'list', value: 'list' }))
      .addStringOption(o => o.setName('word').setDescription('Word to add/remove')))
    .addSubcommand(s => s.setName('spam').setDescription('Toggle spam filter').addBooleanOption(o => o.setName('enabled').setDescription('On or Off').setRequired(true)))
    .addSubcommand(s => s.setName('links').setDescription('Toggle link filter').addBooleanOption(o => o.setName('enabled').setDescription('On or Off').setRequired(true)))
    .addSubcommand(s => s.setName('caps').setDescription('Toggle caps filter').addBooleanOption(o => o.setName('enabled').setDescription('On or Off').setRequired(true)))
    .addSubcommand(s => s.setName('invites').setDescription('Toggle invite filter').addBooleanOption(o => o.setName('enabled').setDescription('On or Off').setRequired(true)))
    .addSubcommand(s => s.setName('action')
      .setDescription('Set punishment action')
      .addStringOption(o => o.setName('type').setDescription('Action type').setRequired(true).addChoices({ name: 'warn', value: 'warn' }, { name: 'mute', value: 'mute' }, { name: 'kick', value: 'kick' }, { name: 'ban', value: 'ban' })))
    .addSubcommand(s => s.setName('logchannel').setDescription('Set log channel').addChannelOption(o => o.setName('channel').setDescription('Log channel').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'enable') { client.db.setAutomod(guildId, 'enabled', 1); return interaction.reply({ embeds: [successEmbed('Auto-Mod Enabled', '🤖 Auto-Mod is now **enabled**.')] }); }
    if (sub === 'disable') { client.db.setAutomod(guildId, 'enabled', 0); return interaction.reply({ embeds: [successEmbed('Auto-Mod Disabled', '🤖 Auto-Mod is now **disabled**.')] }); }

    if (sub === 'status') {
      const a = client.db.getAutomod(guildId);
      const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle('🤖 Auto-Mod Status').addFields(
        { name: 'Status', value: a.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
        { name: 'Action', value: a.action, inline: true },
        { name: 'Bad Words', value: a.bad_words ? '✅' : '❌', inline: true },
        { name: 'Spam', value: a.spam ? '✅' : '❌', inline: true },
        { name: 'Links', value: a.links ? '✅' : '❌', inline: true },
        { name: 'Invites', value: a.invites ? '✅' : '❌', inline: true },
        { name: 'Caps', value: a.caps ? '✅' : '❌', inline: true },
        { name: 'Bad Words List', value: a.bad_words_list.length ? a.bad_words_list.join(', ') : 'None' }
      );
      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'badword') {
      const action = interaction.options.getString('action');
      if (action === 'list') {
        const a = client.db.getAutomod(guildId);
        return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🤖 Bad Words').setDescription(a.bad_words_list.length ? a.bad_words_list.map(w => `\`${w}\``).join(', ') : 'No bad words set.')] });
      }
      const word = interaction.options.getString('word');
      if (!word) return interaction.reply({ embeds: [errorEmbed('Provide a word.')], flags: 64 });
      if (action === 'add') { client.db.addBadWord(guildId, word.toLowerCase()); client.db.setAutomod(guildId, 'bad_words', 1); return interaction.reply({ embeds: [successEmbed('Bad Word Added', `\`${word}\` added to bad words list.`)] }); }
      if (action === 'remove') { client.db.removeBadWord(guildId, word.toLowerCase()); return interaction.reply({ embeds: [successEmbed('Bad Word Removed', `\`${word}\` removed.`)] }); }
    }

    if (['spam', 'links', 'caps', 'invites'].includes(sub)) {
      const val = interaction.options.getBoolean('enabled');
      client.db.setAutomod(guildId, sub, val ? 1 : 0);
      return interaction.reply({ embeds: [successEmbed('Auto-Mod Updated', `**${sub}** filter is now **${val ? 'enabled' : 'disabled'}**.`)] });
    }

    if (sub === 'action') {
      const type = interaction.options.getString('type');
      client.db.setAutomod(guildId, 'action', type);
      return interaction.reply({ embeds: [successEmbed('Action Updated', `Auto-Mod action set to **${type}**.`)] });
    }

    if (sub === 'logchannel') {
      const channel = interaction.options.getChannel('channel');
      client.db.setAutomod(guildId, 'log_channel', channel.id);
      return interaction.reply({ embeds: [successEmbed('Log Channel Set', `Auto-Mod logs will be sent to ${channel}.`)] });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply('❌ Missing permissions.');
    const sub = args[0]?.toLowerCase();
    const guildId = message.guild.id;
    if (sub === 'enable') { client.db.setAutomod(guildId, 'enabled', 1); return message.reply({ embeds: [successEmbed('Auto-Mod Enabled', '🤖 Enabled.')] }); }
    if (sub === 'disable') { client.db.setAutomod(guildId, 'enabled', 0); return message.reply({ embeds: [successEmbed('Auto-Mod Disabled', '🤖 Disabled.')] }); }
    if (sub === 'badword') {
      const action = args[1]?.toLowerCase();
      const word = args[2];
      if (action === 'add' && word) { client.db.addBadWord(guildId, word); client.db.setAutomod(guildId, 'bad_words', 1); return message.reply({ embeds: [successEmbed('Bad Word Added', `\`${word}\` added.`)] }); }
      if (action === 'remove' && word) { client.db.removeBadWord(guildId, word); return message.reply({ embeds: [successEmbed('Bad Word Removed', `\`${word}\` removed.`)] }); }
    }
    if (sub === 'action' && args[1]) { client.db.setAutomod(guildId, 'action', args[1]); return message.reply({ embeds: [successEmbed('Action Set', `Action set to **${args[1]}**.`)] }); }
    const a = client.db.getAutomod(guildId);
    return message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🤖 Auto-Mod').setDescription(`**Status:** ${a.enabled ? '✅' : '❌'} | **Action:** ${a.action}\n**Spam:** ${a.spam ? '✅' : '❌'} | **Links:** ${a.links ? '✅' : '❌'} | **Caps:** ${a.caps ? '✅' : '❌'}\n**Invites:** ${a.invites ? '✅' : '❌'} | **Bad Words:** ${a.bad_words ? '✅' : '❌'}`)] });
  },
};
