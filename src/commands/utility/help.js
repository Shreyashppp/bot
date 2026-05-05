const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const MAIN_MENU = {
  antinuke:  { emoji: '🛡️', label: 'Anti Nuke',        description: 'View commands in Anti Nuke category',        commands: ['`/antinuke enable` — Enable anti-nuke protection', '`/antinuke disable` — Disable anti-nuke', '`/antinuke status` — View settings', '`/antinuke whitelist add/remove/list` — Manage whitelist', '`/antinuke settings` — Configure protections'] },
  automod:   { emoji: '🤖', label: 'Auto Mod',          description: 'View commands in Auto Mod category',          commands: ['`/automod enable/disable` — Toggle auto-mod', '`/automod status` — View settings', '`/automod badword add/remove/list` — Manage bad words', '`/automod spam/links/caps/invites` — Toggle filters', '`/automod action` — Set punishment action', '`/automod logchannel` — Set log channel'] },
  roleconfig: { emoji: '⚙️', label: 'Role Config',      description: 'View commands in Role Config category',       commands: ['`/role give` — Give a role to a member', '`/role remove` — Remove a role from a member', '`/role create` — Create a new role', '`/role delete` — Delete a role', '`/role info` — View role info', '`/role color` — Change role color', '`/role rename` — Rename a role', '`/role all` — Give role to all members'] },
  moderation: { emoji: '🔨', label: 'Moderation',       description: 'View commands in Moderation category',        commands: ['`/ban` — Ban a member', '`/kick` — Kick a member', '`/mute` — Timeout a member', '`/unmute` — Remove timeout', '`/warn` — Warn a member', '`/warnings` — View warnings', '`/clearwarnings` — Clear warnings', '`/delwarn` — Delete a warning', '`/purge` — Bulk delete messages', '`/unban` — Unban a user', '`/softban` — Softban a member', '`/lock` — Lock a channel', '`/unlock` — Unlock a channel', '`/slowmode` — Set slowmode', '`/nick` — Change nickname'] },
  smartmod:  { emoji: '🧠', label: 'Smart Moderation', description: 'View commands in Smart Moderation category', commands: ['`/smartmod enable/disable` — Toggle smart mod', '`/smartmod status` — View thresholds', '`/smartmod set mute_at` — Set mute threshold', '`/smartmod set kick_at` — Set kick threshold', '`/smartmod set ban_at` — Set ban threshold'] },
  jtc:       { emoji: '➕', label: 'Join to Create',    description: 'View commands in Join to Create category',    commands: ['`/jtc setup` — Set up a JTC hub channel', '`/jtc remove` — Remove JTC setup', '`/jtc status` — View JTC settings', '`/voice rename` — Rename your channel', '`/voice lock/unlock` — Lock or unlock your channel', '`/voice limit` — Set user limit', '`/voice kick` — Kick user from channel', '`/voice claim` — Claim ownerless channel'] },
  noprefix:  { emoji: '⚡', label: 'No Prefix',         description: 'View commands in No Prefix category',         commands: ['`/setprefix` — Change the bot prefix', '`/addcmd` — Add a custom command', '`/delcmd` — Delete a custom command', '`/listcmds` — List all custom commands'] },
};

const OTHER_MENU = {
  other:     { emoji: '❓', label: 'Other',             description: 'View commands in Other category',             commands: ['`/uptime` — Show bot uptime', '`/invite` — Get bot invite link'] },
  autorole:  { emoji: '🎭', label: 'Auto Role',         description: 'View commands in Auto Role category',         commands: ['`/autorole add` — Add an autorole', '`/autorole remove` — Remove an autorole', '`/autorole list` — List all autoroles'] },
  welcomer:  { emoji: '👋', label: 'Welcomer',          description: 'View commands in Welcomer category',          commands: ['`/welcome setchannel` — Set welcome channel', '`/welcome setmessage` — Set welcome message', '`/welcome enable/disable` — Toggle welcome', '`/welcome test` — Preview welcome message', '`/leave setchannel/setmessage/enable/disable` — Leave messages'] },
  selfroles: { emoji: '🎀', label: 'Self Roles',        description: 'View commands in Self Roles category',        commands: ['`/selfrole create` — Create a role menu', '`/selfrole add` — Add a role to a menu', '`/selfrole post` — Post menu to channel', '`/selfrole delete` — Delete a menu', '`/selfrole list` — List all menus'] },
  utility:   { emoji: '🔧', label: 'Utility',           description: 'View commands in Utility category',           commands: ['`/ping` — Check bot latency', '`/serverinfo` — View server info', '`/userinfo` — View user info', '`/botinfo` — View bot info', '`/avatar` — View a user\'s avatar', '`/snipe` — Show last deleted message', '`/setlog` — Set log channel'] },
  voice:     { emoji: '🎤', label: 'Voice',             description: 'View commands in Voice category',             commands: ['`/voice rename` — Rename your JTC channel', '`/voice lock` — Lock your channel', '`/voice unlock` — Unlock your channel', '`/voice limit` — Set user limit', '`/voice kick` — Kick a user', '`/voice claim` — Claim a channel'] },
};

const ALL = { ...MAIN_MENU, ...OTHER_MENU };

function buildMainEmbed(client, prefix) {
  const mainList = Object.values(MAIN_MENU).map(c => `${c.emoji} **: ${c.label}**`).join('\n');
  const otherList = Object.values(OTHER_MENU).map(c => `${c.emoji} **: ${c.label}**`).join('\n');
  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle('AETHERBOT HELP MENU')
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(
      `**Prefix** \`${prefix}\`\n**Total Commands: ${client.commands.size + client.prefixCommands.size}**\n\n` +
      `\`\`\`${prefix}help <command> for more info!\nExample: ${prefix}help ban\`\`\``
    )
    .addFields(
      { name: '**Main Menu**', value: mainList, inline: true },
      { name: '**Others Menu**', value: otherList, inline: true }
    )
    .setFooter({ text: 'Select a category below to view its commands.' });
}

function buildCategoryEmbed(cat) {
  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle(`${cat.emoji} ${cat.label}`)
    .setDescription(cat.commands.join('\n'))
    .setFooter({ text: 'Use /help or .help to return to the main menu' });
}

function buildComponents(disabled = false) {
  const mainSelect = new StringSelectMenuBuilder()
    .setCustomId('help_main').setPlaceholder('Main Menu').setDisabled(disabled)
    .addOptions(Object.entries(MAIN_MENU).map(([k, c]) => ({ label: c.label, description: c.description, value: k, emoji: c.emoji })));

  const otherSelect = new StringSelectMenuBuilder()
    .setCustomId('help_other').setPlaceholder('Other Menu').setDisabled(disabled)
    .addOptions(Object.entries(OTHER_MENU).map(([k, c]) => ({ label: c.label, description: c.description, value: k, emoji: c.emoji })));

  const backBtn = new ButtonBuilder().setCustomId('help_back').setLabel('Back to Menu').setStyle(ButtonStyle.Danger).setDisabled(disabled);
  const inviteBtn = new ButtonBuilder().setLabel('Invite Bot').setStyle(ButtonStyle.Link).setURL('https://discord.com/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands');

  return [
    new ActionRowBuilder().addComponents(mainSelect),
    new ActionRowBuilder().addComponents(otherSelect),
    new ActionRowBuilder().addComponents(backBtn, inviteBtn),
  ];
}

module.exports = {
  name: 'help',
  aliases: ['h', 'commands'],
  description: 'Browse all bot commands',
  usage: 'help [command]',
  data: new SlashCommandBuilder().setName('help').setDescription('Browse all bot commands'),

  async execute(interaction, client) {
    const prefix = client.db.getGuild(interaction.guild.id).prefix || '.';
    const embed = buildMainEmbed(client, prefix);
    const components = buildComponents();
    const msg = await interaction.reply({ embeds: [embed], components, fetchReply: true });

    const collector = msg.createMessageComponentCollector({ time: 120000 });
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) return i.reply({ content: 'This menu is not for you.', ephemeral: true });
      if (i.customId === 'help_back') return i.update({ embeds: [buildMainEmbed(client, prefix)], components: buildComponents() });
      if (i.componentType === ComponentType.StringSelect) {
        const cat = ALL[i.values[0]];
        if (cat) await i.update({ embeds: [buildCategoryEmbed(cat)], components: buildComponents() });
      }
    });
    collector.on('end', () => msg.edit({ components: buildComponents(true) }).catch(() => {}));
  },

  async run(message, args, client) {
    const prefix = client.db.getGuild(message.guild.id).prefix || '.';
    const embed = buildMainEmbed(client, prefix);
    const components = buildComponents();
    const msg = await message.reply({ embeds: [embed], components });

    const collector = msg.createMessageComponentCollector({ time: 120000 });
    collector.on('collect', async i => {
      if (i.user.id !== message.author.id) return i.reply({ content: 'This menu is not for you.', ephemeral: true });
      if (i.customId === 'help_back') return i.update({ embeds: [buildMainEmbed(client, prefix)], components: buildComponents() });
      if (i.componentType === ComponentType.StringSelect) {
        const cat = ALL[i.values[0]];
        if (cat) await i.update({ embeds: [buildCategoryEmbed(cat)], components: buildComponents() });
      }
    });
    collector.on('end', () => msg.edit({ components: buildComponents(true) }).catch(() => {}));
  },
};
