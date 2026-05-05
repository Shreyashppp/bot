const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed, infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Configure the welcome message for new members')
    .addChannelOption(opt => opt.setName('channel').setDescription('Welcome channel (leave empty to disable)'))
    .addStringOption(opt =>
      opt.setName('message').setDescription('Welcome message. Use {user}, {server}, {username}, {membercount}')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message') || 'Welcome {user} to **{server}**! You are member #{membercount}.';

    if (!channel) {
      client.db.setWelcome(interaction.guild.id, null, null);
      return interaction.reply({ embeds: [successEmbed('Welcome Disabled', 'Welcome messages have been turned off.')] });
    }

    if (!channel.isTextBased())
      return interaction.reply({ embeds: [errorEmbed('Please select a text channel.')], ephemeral: true });

    client.db.setWelcome(interaction.guild.id, channel.id, message);

    await interaction.reply({
      embeds: [successEmbed('Welcome Channel Set', `Welcome messages will be sent to ${channel}.`)
        .addFields(
          { name: 'Message Preview', value: message },
          { name: 'Variables', value: '`{user}` `{server}` `{username}` `{membercount}`' }
        )
      ],
    });
  },
};
