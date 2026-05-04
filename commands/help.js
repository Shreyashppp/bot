const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const commandCatalog = require('../command-catalog');

const MENU_CONFIG = {
  main: {
    title: 'Main Menu',
    categories: [{ key: 'moderation', label: 'Moderation', emoji: '🔨' }]
  },
  other: {
    title: 'Other Menu',
    categories: [{ key: 'utility', label: 'Utility', emoji: '⚙️' }]
  }
};

const ALL_CATEGORIES = [...MENU_CONFIG.main.categories, ...MENU_CONFIG.other.categories];

function buildOverviewEmbed() {
  return new EmbedBuilder()
    .setColor(0x2b2d42)
    .setTitle('🤖 Professional Help Center')
    .setDescription('Browse commands below')
    .addFields(
      {
        name: 'Main',
        value: MENU_CONFIG.main.categories.map(c => `${c.emoji} ${c.label}`).join('\n'),
        inline: true
      },
      {
        name: 'Other',
        value: MENU_CONFIG.other.categories.map(c => `${c.emoji} ${c.label}`).join('\n'),
        inline: true
      }
    );
}

function buildCategoryEmbed(category) {
  const cmds = commandCatalog.filter(c => c.category === category);

  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`${category.toUpperCase()} Commands`)
    .setDescription(cmds.map(c => `**/${c.name}** - ${c.description}`).join('\n'));
}

function buildCommandEmbed(name) {
  const c = commandCatalog.find(cmd => cmd.name === name);

  return new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle(`/${c.name}`)
    .setDescription(c.description)
    .addFields(
      { name: 'Usage', value: `\`${c.usage}\`` },
      { name: 'Category', value: c.category }
    );
}

function components() {
  return [
    new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('cat')
        .setPlaceholder('Select category')
        .addOptions(
          ALL_CATEGORIES.map(c => ({
            label: c.label,
            value: c.key,
            emoji: c.emoji
          }))
        )
    ),
    new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('cmd')
        .setPlaceholder('Select command')
        .addOptions(
          commandCatalog.map(c => ({
            label: `/${c.name}`,
            value: c.name
          }))
        )
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('home')
        .setLabel('Home')
        .setStyle(ButtonStyle.Secondary)
    )
  ];
}

module.exports = {
  name: 'help',
  category: 'utility',

  async execute(interaction) {
    await interaction.reply({
      embeds: [buildOverviewEmbed()],
      components: components()
    });
  },

  async handleMenuInteraction(interaction) {
    if (interaction.customId === 'cat') {
      return interaction.update({
        embeds: [buildCategoryEmbed(interaction.values[0])],
        components: components()
      });
    }

    if (interaction.customId === 'cmd') {
      return interaction.update({
        embeds: [buildCommandEmbed(interaction.values[0])],
        components: components()
      });
    }

    if (interaction.customId === 'home') {
      return interaction.update({
        embeds: [buildOverviewEmbed()],
        components: components()
      });
    }
  }
};
