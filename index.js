const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to kick')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to ban')
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

    client.on('interactionCreate', async interaction => {if (!interaction.isChatInputCommand()) return;

if (interaction.commandName === 'ping') {
  await interaction.reply('🏓 Pong!');
}

if (interaction.commandName === 'kick') {
  const user = interaction.options.getUser('user');
  const member = interaction.guild.members.cache.get(user.id);

  if (!member) return interaction.reply("User not found");

  await member.kick();
  await interaction.reply(`${user.tag} kicked 👢`);
}

if (interaction.commandName === 'ban') {
  const user = interaction.options.getUser('user');
  const member = interaction.guild.members.cache.get(user.id);

  if (!member) return interaction.reply("User not found");

  await member.ban();
  await interaction.reply(`${user.tag} banned 🔨`);
}
