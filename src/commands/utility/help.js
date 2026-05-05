const {
  SlashCommandBuilder, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType
} = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const CATEGORIES = {
  antinuke:   { emoji: '🛡️', label: 'Anti Nuke',        color: 0xe74c3c, commands: ['`antinuke enable` — Enable anti-nuke', '`antinuke disable` — Disable anti-nuke', '`antinuke status` — View settings', '`antinuke whitelist add/remove/list` — Manage whitelist', '`antinuke settings` — Toggle protections (mass ban/kick/ch/role/bot/webhook)'] },
  automod:    { emoji: '🤖', label: 'Auto Mod',          color: 0xe74c3c, commands: ['`automod enable/disable` — Toggle auto-mod', '`automod status` — View settings', '`automod badword add/remove/list` — Bad words', '`automod spam/links/caps/invites` — Toggle filters', '`automod action` — Set punishment', '`automod logchannel` — Set log channel'] },
  roleconfig: { emoji: '⚙️', label: 'Role Config',       color: 0xe74c3c, commands: ['`role give <user> <role>` — Give role', '`role remove <user> <role>` — Remove role', '`role create <name>` — Create role', '`role delete <role>` — Delete role', '`role info <role>` — Role info', '`role color <role> <hex>` — Change color', '`role rename <role> <name>` — Rename', '`role all <role>` — Give to all members'] },
  moderation: { emoji: '🔨', label: 'Moderation',        color: 0xe74c3c, commands: ['`ban <user> [reason]` — Ban member', '`kick <user> [reason]` — Kick member', '`mute <user> [dur] [reason]` — Timeout', '`unmute <user>` — Remove timeout', '`warn <user> [reason]` — Warn member', '`warnings <user>` — View warnings', '`clearwarnings <user>` — Clear warns', '`delwarn <id>` — Delete a warning', '`purge <amount>` — Delete messages', '`unban <id>` — Unban user', '`softban <user>` — Softban member', '`lock/unlock [channel]` — Lock channel', '`slowmode <secs>` — Set slowmode', '`nick <user> [name]` — Change nickname'] },
  smartmod:   { emoji: '🧠', label: 'Smart Mod',         color: 0xe74c3c, commands: ['`smartmod enable/disable` — Toggle', '`smartmod status` — View thresholds', '`smartmod set mute_at <n>` — Mute threshold', '`smartmod set kick_at <n>` — Kick threshold', '`smartmod set ban_at <n>` — Ban threshold'] },
  jtc:        { emoji: '➕', label: 'Join to Create',    color: 0xe74c3c, commands: ['`jtc setup <channel>` — Set hub channel', '`jtc remove` — Disable JTC', '`jtc status` — View JTC settings', '`voice rename <name>` — Rename your channel', '`voice lock/unlock` — Lock your channel', '`voice limit <n>` — Set user limit', '`voice kick <user>` — Kick from channel', '`voice claim` — Claim ownerless channel'] },
  noprefix:   { emoji: '⚡', label: 'No Prefix',         color: 0xe74c3c, commands: ['`setprefix <prefix>` — Change server prefix', '`addcmd <name> <response>` — Add custom command', '`delcmd <name>` — Delete custom command', '`listcmds` — List all custom commands'] },
  other:      { emoji: '❓', label: 'Other',             color: 0xe74c3c, commands: ['`uptime` — Show bot uptime', '`invite` — Get bot invite link', '`ping` — Check bot latency', '`botinfo` — View bot information'] },
  autorole:   { emoji: '🎭', label: 'Auto Role',         color: 0xe74c3c, commands: ['`autorole add <role> [type]` — Add autorole', '`autorole remove <role>` — Remove autorole', '`autorole list` — List all autoroles', 'Types: `all` (default), `human`, `bot`'] },
  welcomer:   { emoji: '👋', label: 'Welcomer',          color: 0xe74c3c, commands: ['`welcome setchannel <ch>` — Set channel', '`welcome setmessage <msg>` — Set message', '`welcome enable/disable` — Toggle welcome', '`welcome test` — Preview message', '`leave setchannel/setmessage/enable/disable`', 'Variables: `{user}` `{username}` `{server}` `{membercount}`'] },
  selfroles:  { emoji: '🎀', label: 'Self Roles',        color: 0xe74c3c, commands: ['`selfrole create <title>` — Create menu', '`selfrole add <id> <role> <label>` — Add role', '`selfrole post <id>` — Post menu', '`selfrole delete <id>` — Delete menu', '`selfrole list` — List all menus'] },
  utility:    { emoji: '🔧', label: 'Utility',           color: 0xe74c3c, commands: ['`serverinfo` — Server information', '`userinfo [user]` — User information', '`avatar [user]` — View avatar', '`snipe` — Last deleted message', '`setlog <channel>` — Set log channel', '`ping` — Bot latency', '`botinfo` — Bot info'] },
  voice:      { emoji: '🎤', label: 'Voice',             color: 0xe74c3c, commands: ['`voice rename <name>` — Rename JTC channel', '`voice lock` — Lock your channel', '`voice unlock` — Unlock your channel', '`voice limit <n>` — Set user limit', '`voice kick <user>` — Kick a user', '`voice claim` — Claim a channel'] },
};

const MAIN_CATS  = ['antinuke', 'automod', 'roleconfig', 'moderation', 'smartmod', 'jtc', 'noprefix'];
const OTHER_CATS = ['other', 'autorole', 'welcomer', 'selfroles', 'utility', 'voice'];

function mainEmbed(client, prefix) {
  const mainList  = MAIN_CATS .map(k => `${CATEGORIES[k].emoji} **${CATEGORIES[k].label}**`).join('\n');
  const otherList = OTHER_CATS.map(k => `${CATEGORIES[k].emoji} **${CATEGORIES[k].label}**`).join('\n');

  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
    .setTitle('『 HELP MENU 』')
    .setDescription(
      `> **Prefix** \`${prefix}\`  •  **Commands** \`${Object.keys(CATEGORIES).length} categories\`\n` +
      `> Use the buttons below to explore commands.\n\u200b`
    )
    .addFields(
      { name: '── Main Menu ──', value: mainList,  inline: true },
      { name: '\u200b',          value: '\u200b',  inline: true },
      { name: '── Others ──',    value: otherList, inline: true }
    )
    .setImage('https://i.imgur.com/placeholder.gif')
    .setFooter({ text: `${client.user.username} • Prefix: ${prefix}` })
    .setTimestamp();
}

function categoryEmbed(key, client, prefix) {
  const cat = CATEGORIES[key];
  return new EmbedBuilder()
    .setColor(cat.color)
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
    .setTitle(`${cat.emoji}  ${cat.label}`)
    .setDescription(cat.commands.map(c => `> ${c}`).join('\n'))
    .setFooter({ text: `Prefix: ${prefix}  •  Use slash (/) or prefix (${prefix})` })
    .setTimestamp();
}

function buildRows(disabled = false) {
  const btn = (id, cat, style = ButtonStyle.Secondary) =>
    new ButtonBuilder()
      .setCustomId(`help_cat_${id}`)
      .setEmoji(CATEGORIES[id].emoji)
      .setLabel(CATEGORIES[id].label)
      .setStyle(style)
      .setDisabled(disabled);

  return [
    new ActionRowBuilder().addComponents(
      btn('antinuke'), btn('automod'), btn('roleconfig'), btn('moderation'), btn('smartmod')
    ),
    new ActionRowBuilder().addComponents(
      btn('jtc'), btn('noprefix'), btn('other'), btn('autorole'), btn('welcomer')
    ),
    new ActionRowBuilder().addComponents(
      btn('selfroles'), btn('utility'), btn('voice'),
      new ButtonBuilder().setCustomId('help_home').setEmoji('🏠').setLabel('Home').setStyle(ButtonStyle.Danger).setDisabled(disabled)
    ),
  ];
}

async function handleHelp(send, userId, client, prefix) {
  const embed = mainEmbed(client, prefix);
  const rows  = buildRows();
  const msg   = await send({ embeds: [embed], components: rows });

  const collector = msg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 120_000,
  });

  collector.on('collect', async i => {
    if (i.user.id !== userId)
      return i.reply({ content: '❌ This menu is not yours.', ephemeral: true });

    if (i.customId === 'help_home') {
      return i.update({ embeds: [mainEmbed(client, prefix)], components: buildRows() });
    }

    const key = i.customId.replace('help_cat_', '');
    if (CATEGORIES[key]) {
      await i.update({ embeds: [categoryEmbed(key, client, prefix)], components: buildRows() });
    }
  });

  collector.on('end', () => {
    msg.edit({ components: buildRows(true) }).catch(() => {});
  });

  return msg;
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
    await handleHelp(
      async (payload) => {
        const { response } = await interaction.reply({ ...payload, withResponse: true });
        return response;
      },
      interaction.user.id,
      client,
      prefix
    );
  },

  async run(message, args, client) {
    const prefix = client.db.getGuild(message.guild.id).prefix || '.';
    await handleHelp(
      (payload) => message.reply(payload),
      message.author.id,
      client,
      prefix
    );
  },
};
