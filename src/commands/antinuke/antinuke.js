const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'antinuke',
  aliases: ['an'],
  description: 'Manage Anti-Nuke protection',
  usage: 'antinuke <enable|disable|status|whitelist|settings>',
  data: new SlashCommandBuilder()
    .setName('antinuke')
    .setDescription('Manage Anti-Nuke protection')
    .addSubcommand(s => s.setName('enable').setDescription('Enable anti-nuke'))
    .addSubcommand(s => s.setName('disable').setDescription('Disable anti-nuke'))
    .addSubcommand(s => s.setName('status').setDescription('View anti-nuke settings'))
    .addSubcommand(s => s.setName('whitelist')
      .setDescription('Manage whitelist')
      .addStringOption(o => o.setName('action').setDescription('add or remove').setRequired(true).addChoices({ name: 'add', value: 'add' }, { name: 'remove', value: 'remove' }, { name: 'list', value: 'list' }))
      .addUserOption(o => o.setName('user').setDescription('User to whitelist')))
    .addSubcommand(s => s.setName('settings')
      .setDescription('Configure anti-nuke')
      .addStringOption(o => o.setName('protection').setDescription('Protection type').setRequired(true)
        .addChoices(
          { name: 'Mass Ban', value: 'mass_ban' },
          { name: 'Mass Kick', value: 'mass_kick' },
          { name: 'Mass Channel Delete', value: 'mass_channel_delete' },
          { name: 'Mass Role Delete', value: 'mass_role_delete' },
          { name: 'Bot Add', value: 'bot_add' },
          { name: 'Webhook Create', value: 'webhook_create' }
        ))
      .addBooleanOption(o => o.setName('enabled').setDescription('Enable or disable this protection').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({ embeds: [errorEmbed('You need Administrator permission.')], ephemeral: true });

    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'enable') {
      client.db.setAntinuke(guildId, 'enabled', 1);
      return interaction.reply({ embeds: [successEmbed('Anti-Nuke Enabled', '🛡️ Anti-Nuke protection is now **enabled**.')] });
    }

    if (sub === 'disable') {
      client.db.setAntinuke(guildId, 'enabled', 0);
      return interaction.reply({ embeds: [successEmbed('Anti-Nuke Disabled', '🛡️ Anti-Nuke protection is now **disabled**.')] });
    }

    if (sub === 'status') {
      const an = client.db.getAntinuke(guildId);
      const wl = client.db.getAntinukeWhitelist(guildId);
      const embed = new EmbedBuilder().setColor(COLORS.primary)
        .setTitle('🛡️ Anti-Nuke Status')
        .addFields(
          { name: 'Status', value: an.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Action', value: an.action || 'ban', inline: true },
          { name: 'Threshold', value: `${an.threshold} actions/10s`, inline: true },
          { name: 'Mass Ban', value: an.mass_ban ? '✅' : '❌', inline: true },
          { name: 'Mass Kick', value: an.mass_kick ? '✅' : '❌', inline: true },
          { name: 'Mass Ch. Delete', value: an.mass_channel_delete ? '✅' : '❌', inline: true },
          { name: 'Mass Role Delete', value: an.mass_role_delete ? '✅' : '❌', inline: true },
          { name: 'Bot Add', value: an.bot_add ? '✅' : '❌', inline: true },
          { name: 'Webhook Create', value: an.webhook_create ? '✅' : '❌', inline: true },
          { name: 'Whitelist', value: wl.length ? wl.map(id => `<@${id}>`).join(', ') : 'None' }
        );
      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'whitelist') {
      const action = interaction.options.getString('action');
      if (action === 'list') {
        const wl = client.db.getAntinukeWhitelist(guildId);
        return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🛡️ Anti-Nuke Whitelist').setDescription(wl.length ? wl.map(id => `<@${id}>`).join('\n') : 'No users whitelisted.')] });
      }
      const user = interaction.options.getUser('user');
      if (!user) return interaction.reply({ embeds: [errorEmbed('Provide a user.')], ephemeral: true });
      if (action === 'add') {
        client.db.addAntinukeWhitelist(guildId, user.id);
        return interaction.reply({ embeds: [successEmbed('Whitelist Updated', `**${user.tag}** added to Anti-Nuke whitelist.`)] });
      }
      if (action === 'remove') {
        client.db.removeAntinukeWhitelist(guildId, user.id);
        return interaction.reply({ embeds: [successEmbed('Whitelist Updated', `**${user.tag}** removed from Anti-Nuke whitelist.`)] });
      }
    }

    if (sub === 'settings') {
      const protection = interaction.options.getString('protection');
      const enabled = interaction.options.getBoolean('enabled');
      client.db.setAntinuke(guildId, protection, enabled ? 1 : 0);
      return interaction.reply({ embeds: [successEmbed('Settings Updated', `**${protection.replace(/_/g, ' ')}** is now **${enabled ? 'enabled' : 'disabled'}**.`)] });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('❌ Administrator only.');
    const sub = args[0]?.toLowerCase();
    const guildId = message.guild.id;
    if (sub === 'enable') {
      client.db.setAntinuke(guildId, 'enabled', 1);
      return message.reply({ embeds: [successEmbed('Anti-Nuke Enabled', '🛡️ Anti-Nuke is now **enabled**.')] });
    }
    if (sub === 'disable') {
      client.db.setAntinuke(guildId, 'enabled', 0);
      return message.reply({ embeds: [successEmbed('Anti-Nuke Disabled', '🛡️ Anti-Nuke is now **disabled**.')] });
    }
    if (sub === 'whitelist') {
      const action = args[1]?.toLowerCase();
      const userId = message.mentions.users.first()?.id || args[2];
      if (action === 'add' && userId) { client.db.addAntinukeWhitelist(guildId, userId); return message.reply({ embeds: [successEmbed('Whitelist Updated', `<@${userId}> added.`)] }); }
      if (action === 'remove' && userId) { client.db.removeAntinukeWhitelist(guildId, userId); return message.reply({ embeds: [successEmbed('Whitelist Updated', `<@${userId}> removed.`)] }); }
      const wl = client.db.getAntinukeWhitelist(guildId);
      return message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🛡️ Whitelist').setDescription(wl.length ? wl.map(id => `<@${id}>`).join('\n') : 'None')] });
    }
    const an = client.db.getAntinuke(guildId);
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle('🛡️ Anti-Nuke Status')
      .setDescription(`**Status:** ${an.enabled ? '✅ Enabled' : '❌ Disabled'}\n**Threshold:** ${an.threshold}\n**Mass Ban:** ${an.mass_ban ? '✅' : '❌'} | **Mass Kick:** ${an.mass_kick ? '✅' : '❌'}\n**Bot Add:** ${an.bot_add ? '✅' : '❌'} | **Webhooks:** ${an.webhook_create ? '✅' : '❌'}`);
    return message.reply({ embeds: [embed] });
  },
};
