const {
  SlashCommandBuilder, EmbedBuilder,
  ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType
} = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const CATEGORIES = {
  antinuke:   { emoji: '🛡️', label: 'Anti Nuke',        commands: ['`antinuke enable` — Enable anti-nuke', '`antinuke disable` — Disable anti-nuke', '`antinuke status` — View settings', '`antinuke whitelist add/remove/list` — Manage whitelist', '`antinuke settings` — Toggle protections (mass ban/kick/ch/role/bot/webhook)'] },
  automod:    { emoji: '🤖', label: 'Auto Mod',          commands: ['`automod enable/disable` — Toggle auto-mod', '`automod status` — View settings', '`automod badword add/remove/list` — Bad words list', '`automod spam/links/caps/invites` — Toggle filters', '`automod action` — Set punishment action', '`automod logchannel` — Set log channel'] },
  roleconfig: { emoji: '⚙️', label: 'Role Config',       commands: ['`role give <user> <role>` — Give role to member', '`role remove <user> <role>` — Remove role', '`role create <name>` — Create a role', '`role delete <role>` — Delete a role', '`role info <role>` — View role info', '`role color <role> <hex>` — Change color', '`role rename <role> <name>` — Rename role', '`role all <role>` — Give role to all members'] },
  moderation: { emoji: '🔨', label: 'Moderation',        commands: ['`ban <user> [reason]` — Ban a member', '`kick <user> [reason]` — Kick a member', '`mute <user> [dur] [reason]` — Timeout member', '`unmute <user>` — Remove timeout', '`warn <user> [reason]` — Warn a member', '`warnings <user>` — View all warnings', '`clearwarnings <user>` — Clear all warnings', '`delwarn <id>` — Delete a warning', '`purge <amount>` — Bulk delete messages', '`unban <id>` — Unban a user', '`softban <user>` — Softban member', '`lock/unlock [channel]` — Lock a channel', '`slowmode <secs>` — Set slowmode', '`nick <user> [name]` — Change nickname'] },
  smartmod:   { emoji: '🧠', label: 'Smart Moderation', commands: ['`smartmod enable/disable` — Toggle smart mod', '`smartmod status` — View thresholds', '`smartmod set mute_at <n>` — Set mute threshold', '`smartmod set kick_at <n>` — Set kick threshold', '`smartmod set ban_at <n>` — Set ban threshold'] },
  jtc:        { emoji: '➕', label: 'Join to Create',    commands: ['`jtc setup <channel>` — Set hub channel', '`jtc remove` — Disable JTC', '`jtc status` — View JTC settings', '`voice rename <name>` — Rename your channel', '`voice lock/unlock` — Lock/unlock channel', '`voice limit <n>` — Set user limit', '`voice kick <user>` — Kick from channel', '`voice claim` — Claim an ownerless channel'] },
  noprefix:   { emoji: '⚡', label: 'No Prefix',         commands: ['`setprefix <prefix>` — Change server prefix', '`addcmd <name> <response>` — Add custom command', '`delcmd <name>` — Delete custom command', '`listcmds` — List all custom commands'] },
  other:      { emoji: '❓', label: 'Other',             commands: ['`uptime` — Show bot uptime', '`invite` — Get bot invite link', '`ping` — Check bot latency', '`botinfo` — View bot information'] },
  autorole:   { emoji: '🎭', label: 'Auto Role',         commands: ['`autorole add <role> [type]` — Add autorole', '`autorole remove <role>` — Remove autorole', '`autorole list` — List all autoroles', 'Types: `all` (default), `human`, `bot`'] },
  welcomer:   { emoji: '👋', label: 'Welcomer',          commands: ['`welcome setchannel <ch>` — Set channel', '`welcome setmessage <msg>` — Set message', '`welcome enable/disable` — Toggle welcome', '`welcome test` — Preview welcome message', '`leave setchannel/setmessage/enable/disable` — Leave messages', 'Variables: `{user}` `{username}` `{server}` `{membercount}`'] },
  selfroles:  { emoji: '🎀', label: 'Self Roles',        commands: ['`selfrole create <title>` — Create a menu', '`selfrole add <id> <role> <label>` — Add role to menu', '`selfrole post <id> [channel]` — Post menu', '`selfrole delete <id>` — Delete a menu', '`selfrole list` — List all menus'] },
  utility:    { emoji: '🔧', label: 'Utility',           commands: ['`serverinfo` — View server information', '`userinfo [user]` — View user information', '`avatar [user]` — View user avatar', '`snipe` — Last deleted message', '`setlog <channel>` — Set log channel', '`ping` — Bot latency', '`botinfo` — Bot information'] },
  voice:      { emoji: '🎤', label: 'Voice',             commands: ['`voice rename <name>` — Rename your JTC channel', '`voice lock` — Lock your channel', '`voice unlock` — Unlock your channel', '`voice limit <n>` — Set user limit', '`voice kick <user>` — Kick a user from channel', '`voice claim` — Claim an ownerless channel'] },
};

const MAIN_CATS  = ['antinuke', 'automod', 'roleconfig', 'moderation', 'smartmod', 'jtc', 'noprefix'];
const OTHER_CATS = ['other', 'autorole', 'welcomer', 'selfroles', 'utility', 'voice'];

function mainEmbed(client, prefix) {
  const mainList  = MAIN_CATS .map(k => `${CATEGORIES[k].emoji} **: ${CATEGORIES[k].label}**`).join('\n');
  const otherList = OTHER_CATS.map(k => `${CATEGORIES[k].emoji} **: ${CATEGORIES[k].label}**`).join('\n');
  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setAuthor({ name: `${client.user.username} Help`, iconURL: client.user.displayAvatarURL() })
    .setTitle('『 HELP MENU 』')
    .setDescription(`**Prefix** \`${prefix}\`\n**Total Commands:** \`39 slash + prefix\`\n\n\`\`\`${prefix}help <command> for more info!\`\`\``)
    .addFields(
      { name: '**✦ Main Menu**',   value: mainList,  inline: true },
      { name: '**✦ Others Menu**', value: otherList, inline: true }
    )
    .setFooter({ text: `Select a category from the dropdown below • ${prefix}help` })
    .setTimestamp();
}

function categoryEmbed(key, client, prefix) {
  const cat = CATEGORIES[key];
  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setAuthor({ name: `${client.user.username} Help`, iconURL: client.user.displayAvatarURL() })
    .setTitle(`${cat.emoji}  ${cat.label}`)
    .setDescription(cat.commands.join('\n'))
    .setFooter({ text: `Prefix: ${prefix}  •  Also works as /slash commands` })
    .setTimestamp();
}

function buildComponents(disabled = false) {
  const mainMenu = new StringSelectMenuBuilder()
    .setCustomId('help_main')
    .setPlaceholder('✦ Main Menu')
    .setDisabled(disabled)
    .addOptions(MAIN_CATS.map(k => ({
      label: CATEGORIES[k].label,
      value: k,
      emoji: CATEGORIES[k].emoji,
      description: `View ${CATEGORIES[k].label} commands`,
    })));

  const otherMenu = new StringSelectMenuBuilder()
    .setCustomId('help_other')
    .setPlaceholder('✦ Others Menu')
    .setDisabled(disabled)
    .addOptions(OTHER_CATS.map(k => ({
      label: CATEGORIES[k].label,
      value: k,
      emoji: CATEGORIES[k].emoji,
      description: `View ${CATEGORIES[k].label} commands`,
    })));

  const backBtn = new ButtonBuilder()
    .setCustomId('help_home')
    .setLabel('Back to Menu')
    .setEmoji('🏠')
    .setStyle(ButtonStyle.Danger)
    .setDisabled(disabled);

  const inviteBtn = new ButtonBuilder()
    .setLabel('Invite Bot')
    .setStyle(ButtonStyle.Link)
    .setEmoji('📨')
    .setURL('https://discord.com/oauth2/authorize?client_id=1368924261483065445&permissions=8&scope=bot%20applications.commands');

  return [
    new ActionRowBuilder().addComponents(mainMenu),
    new ActionRowBuilder().addComponents(otherMenu),
    new ActionRowBuilder().addComponents(backBtn, inviteBtn),
  ];
}

function setupCollector(msg, userId, client, prefix) {
  const collector = msg.createMessageComponentCollector({ time: 120_000 });

  collector.on('collect', async i => {
    if (i.user.id !== userId)
      return i.reply({ content: '❌ This menu is not for you.', flags: 64 });

    if (i.customId === 'help_home') {
      return i.update({ embeds: [mainEmbed(client, prefix)], components: buildComponents() });
    }

    if (i.componentType === ComponentType.StringSelect) {
      const key = i.values[0];
      if (CATEGORIES[key]) {
        return i.update({ embeds: [categoryEmbed(key, client, prefix)], components: buildComponents() });
      }
    }
  });

  collector.on('end', () => {
    msg.edit({ components: buildComponents(true) }).catch(() => {});
  });
}

module.exports = {
  name: 'help',
  aliases: ['h', 'commands', 'cmds'],
  description: 'Browse all bot commands',
  usage: 'help',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Browse all bot commands'),

  async execute(interaction, client) {
    const prefix = client.db.getGuild(interaction.guild.id).prefix || '.';
    await interaction.reply({ embeds: [mainEmbed(client, prefix)], components: buildComponents() });
    const msg = await interaction.fetchReply();
    setupCollector(msg, interaction.user.id, client, prefix);
  },

  async run(message, args, client) {
    const prefix = client.db.getGuild(message.guild.id).prefix || '.';
    const msg = await message.reply({ embeds: [mainEmbed(client, prefix)], components: buildComponents() });
    setupCollector(msg, message.author.id, client, prefix);
  },
};
