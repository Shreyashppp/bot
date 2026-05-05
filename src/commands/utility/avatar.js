const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'avatar',
  aliases: ['av', 'pfp'],
  description: 'View a user\'s avatar',
  usage: 'avatar [user]',
  data: new SlashCommandBuilder().setName('avatar').setDescription('View a user\'s avatar').addUserOption(o => o.setName('user').setDescription('User')),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user') || interaction.user;
    const url = user.displayAvatarURL({ dynamic: true, size: 1024 });
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle(`${user.tag}'s Avatar`).setImage(url).setURL(url)] });
  },

  async run(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const url = user.displayAvatarURL({ dynamic: true, size: 1024 });
    await message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle(`${user.tag}'s Avatar`).setImage(url).setURL(url)] });
  },
};
