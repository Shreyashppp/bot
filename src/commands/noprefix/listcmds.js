const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'listcmds',
  aliases: ['listcommands', 'customcmds'],
  description: 'List all custom commands',
  usage: 'listcmds',
  data: new SlashCommandBuilder()
    .setName('listcmds')
    .setDescription('List all custom commands'),

  async execute(interaction, client) {
    const cmds = client.db.listCustomCommands(interaction.guild.id);
    return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('📝 Custom Commands').setDescription(cmds.length ? cmds.map(c => `\`${c.name}\` — ${c.response.slice(0, 50)}`).join('\n') : 'No custom commands set.')] });
  },

  async run(message, args, client) {
    const cmds = client.db.listCustomCommands(message.guild.id);
    return message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('📝 Custom Commands').setDescription(cmds.length ? cmds.map(c => `\`${c.name}\` — ${c.response.slice(0, 50)}`).join('\n') : 'None.')] });
  },
};
