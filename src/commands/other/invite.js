const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'invite',
  description: 'Get the bot invite link',
  usage: 'invite',
  data: new SlashCommandBuilder().setName('invite').setDescription('Get the bot invite link'),

  async execute(interaction, client) {
    const url = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('📨 Invite Aetherbot').setDescription(`[Click here to invite me!](${url})`).setTimestamp()] });
  },

  async run(message, args, client) {
    const url = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
    await message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('📨 Invite Aetherbot').setDescription(`[Click here to invite me!](${url})`)] });
  },
};
