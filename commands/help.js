const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const commandCatalog = require('../command-catalog');

const CATEGORY_META = {
  moderation: {
    label: 'Moderation',
    emoji: '🛡️',
    color: 0xed4245,
    summary: 'Keep your server safe with member management and cleanup tools.'
  },
  utility: {
    label: 'Utility',
    emoji: '⚙️',
    color: 0x5865f2,
    summary: 'Core utility commands for status checks and navigation.'
  }
};

function prettyCategoryName(category) {
  const known = CATEGORY_META[category];
  if (known) {
    return `${known.emoji} ${known.label}`;
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

function commandCountForCategory(category) {
  return commandCatalog.filter(command => command.category === category).length;
}

function buildCategoryOptions() {
  const uniqueCategories = [...new Set(commandCatalog.map(command => command.category))];

  return uniqueCategories.map(category => ({
    label: CATEGORY_META[category]?.label || category,
    description: CATEGORY_META[category]?.summary || `Browse all ${category} commands`,
    emoji: CATEGORY_META[category]?.emoji,
    value: category
  }));
}

function buildCommandOptions() {
  return commandCatalog.map(command => ({
    label: `/${command.name}`,
    description: command.description.slice(0, 100),
    value: command.name
  }));
}

function buildComponents(ownerId) {
  return [
    new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`help:category:${ownerId}`)
        .setPlaceholder('Choose a command category')
        .addOptions(buildCategoryOptions())
    ),
    new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`help:command:${ownerId}`)
        .setPlaceholder('Choose a command for detailed usage')
        .addOptions(buildCommandOptions())
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`help:home:${ownerId}`)
        .setLabel('Back to Home')
        .setStyle(ButtonStyle.Secondary)
    )
  ];
}

function buildOverviewEmbed() {
  const uniqueCategories = [...new Set(commandCatalog.map(command => command.category))];
  const embed = new EmbedBuilder()
    .setColor(0x2b2d42)
    .setTitle('🤖 E.D.I.T.H Professional Command Center')
    .setDescription(
      'Use the menus below to browse categories, inspect command usage, and moderate your server.'
    );

  embed.addFields(
    uniqueCategories.map(category => ({
      name: prettyCategoryName(category),
      value: `${commandCountForCategory(category)} command(s)`,
      inline: true
    }))
  );

  return embed.setFooter({
    text: 'Tip: select a command to instantly view syntax and examples.'
  });
}

function buildCategoryEmbed(category) {
  const commands = commandCatalog.filter(command => command.category === category);

  if (!commands.length) {
    return new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle('Category Not Found')
      .setDescription('That category does not exist in the current command catalog.');
  }

  return new EmbedBuilder()
    .setColor(CATEGORY_META[category]?.color || 0x5865f2)
    .setTitle(`${prettyCategoryName(category)} Commands`)
    .setDescription(CATEGORY_META[category]?.summary || 'Browse available commands below.')
    .addFields(
      commands.map(command => ({
        name: `/${command.name}`,
        value: `${command.description}\nUsage: \`${command.usage}\``
      }))
    );
}

function buildCommandEmbed(commandName) {
  const command = commandCatalog.find(entry => entry.name === commandName);

  if (!command) {
    return new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle('Command Not Found')
      .setDescription('That command does not exist in the current command catalog.');
  }

  return new EmbedBuilder()
    .setColor(CATEGORY_META[command.category]?.color || 0x57f287)
    .setTitle(`/${command.name}`)
    .setDescription(command.description)
    .addFields(
      { name: 'Usage', value: `\`${command.usage}\`` },
      { name: 'Category', value: prettyCategoryName(command.category), inline: true },
      {
        name: 'Options',
        value: command.options?.length
          ? command.options
              .map(option => `• \`${option.name}\` - ${option.description}`)
              .join('\n')
          : 'No options'
      }
    );
}

function parseHelpCustomId(customId) {
  const [namespace, action, ownerId] = customId.split(':');
  if (namespace !== 'help' || !action || !ownerId) {
    return null;
  }

  return { action, ownerId };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Open the interactive command center with categories and usage guides.'),
  category: 'utility',

  async execute(interaction) {
    await interaction.reply({
      embeds: [buildOverviewEmbed()],
      components: buildComponents(interaction.user.id)
    });
  },

  async handleComponentInteraction(interaction) {
    if (!interaction.customId?.startsWith('help:')) {
      return;
    }

    const parsed = parseHelpCustomId(interaction.customId);
    if (!parsed) {
      return;
    }

    if (parsed.ownerId !== interaction.user.id) {
      await interaction.reply({
        content: 'Only the user who opened this help panel can use it. Run `/help` to open your own panel.',
        ephemeral: true
      });
      return;
    }

    if (parsed.action === 'category' && interaction.isStringSelectMenu()) {
      await interaction.update({
        embeds: [buildCategoryEmbed(interaction.values[0])],
        components: buildComponents(parsed.ownerId)
      });
      return;
    }

    if (parsed.action === 'command' && interaction.isStringSelectMenu()) {
      await interaction.update({
        embeds: [buildCommandEmbed(interaction.values[0])],
        components: buildComponents(parsed.ownerId)
      });
      return;
    }

    if (parsed.action === 'home' && interaction.isButton()) {
      await interaction.update({
        embeds: [buildOverviewEmbed()],
        components: buildComponents(parsed.ownerId)
      });
    }
  }
};