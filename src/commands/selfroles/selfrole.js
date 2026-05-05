const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'selfrole',
  aliases: ['sr'],
  description: 'Manage self-assignable role menus',
  usage: 'selfrole <create|add|delete|list>',
  data: new SlashCommandBuilder()
    .setName('selfrole')
    .setDescription('Manage self-assignable role menus')
    .addSubcommand(s => s.setName('create').setDescription('Create a role menu')
      .addStringOption(o => o.setName('title').setDescription('Menu title').setRequired(true))
      .addStringOption(o => o.setName('description').setDescription('Menu description')))
    .addSubcommand(s => s.setName('add').setDescription('Add a role to a menu')
      .addIntegerOption(o => o.setName('menu_id').setDescription('Menu ID').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))
      .addStringOption(o => o.setName('label').setDescription('Button label').setRequired(true))
      .addStringOption(o => o.setName('emoji').setDescription('Button emoji')))
    .addSubcommand(s => s.setName('delete').setDescription('Delete a role menu').addIntegerOption(o => o.setName('menu_id').setDescription('Menu ID').setRequired(true)))
    .addSubcommand(s => s.setName('list').setDescription('List all role menus'))
    .addSubcommand(s => s.setName('post').setDescription('Post a menu to a channel')
      .addIntegerOption(o => o.setName('menu_id').setDescription('Menu ID').setRequired(true))
      .addChannelOption(o => o.setName('channel').setDescription('Channel to post in')))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'create') {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description') || 'Click a button below to get or remove a role.';
      const menuId = client.db.createSelfroleMenu(guildId, null, null, title, description);
      return interaction.reply({ embeds: [successEmbed('Menu Created', `Menu **#${menuId}** created.\nUse \`/selfrole add menu_id:${menuId}\` to add roles, then \`/selfrole post menu_id:${menuId}\` to post it.`)] });
    }

    if (sub === 'add') {
      const menuId = interaction.options.getInteger('menu_id');
      const role = interaction.options.getRole('role');
      const label = interaction.options.getString('label');
      const emoji = interaction.options.getString('emoji') || null;
      const menu = client.db.getSelfroleMenu(menuId);
      if (!menu || menu.guild_id !== guildId) return interaction.reply({ embeds: [errorEmbed('Menu not found.')], ephemeral: true });
      client.db.addSelfroleEntry(menuId, role.id, label, emoji);
      return interaction.reply({ embeds: [successEmbed('Role Added', `${role} added to menu **#${menuId}**.`)] });
    }

    if (sub === 'post') {
      const menuId = interaction.options.getInteger('menu_id');
      const channel = interaction.options.getChannel('channel') || interaction.channel;
      const menu = client.db.getSelfroleMenu(menuId);
      if (!menu || menu.guild_id !== guildId) return interaction.reply({ embeds: [errorEmbed('Menu not found.')], ephemeral: true });
      const entries = client.db.getSelfroleEntries(menuId);
      if (!entries.length) return interaction.reply({ embeds: [errorEmbed('No roles added to this menu yet.')], ephemeral: true });

      const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle(menu.title).setDescription(menu.description);
      const rows = [];
      for (let i = 0; i < entries.length; i += 5) {
        const row = new ActionRowBuilder();
        entries.slice(i, i + 5).forEach(e => {
          const btn = new ButtonBuilder().setCustomId(`selfrole_${e.role_id}`).setLabel(e.label).setStyle(ButtonStyle.Secondary);
          if (e.emoji) btn.setEmoji(e.emoji);
          row.addComponents(btn);
        });
        rows.push(row);
      }

      const msg = await channel.send({ embeds: [embed], components: rows });
      client.db.updateSelfroleMenuMessage(menuId, msg.id);
      client.db.db.prepare('UPDATE selfrole_menus SET channel_id = ? WHERE id = ?').run(channel.id, menuId);
      return interaction.reply({ embeds: [successEmbed('Menu Posted', `Role menu posted in ${channel}.`)], ephemeral: true });
    }

    if (sub === 'delete') {
      const menuId = interaction.options.getInteger('menu_id');
      client.db.deleteSelfroleMenu(menuId);
      return interaction.reply({ embeds: [successEmbed('Menu Deleted', `Menu **#${menuId}** deleted.`)] });
    }

    if (sub === 'list') {
      const menus = client.db.getGuildSelfrolemenus(guildId);
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🎭 Self Role Menus').setDescription(menus.length ? menus.map(m => `**#${m.id}** — ${m.title}`).join('\n') : 'No menus created.')] });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply('❌ Missing permissions.');
    return message.reply('Please use `/selfrole` slash command to manage self roles.');
  },
};
