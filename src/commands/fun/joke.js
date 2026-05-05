const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');
const https = require('https');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const data = await fetchJSON('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist');
      let jokeText;
      if (data.type === 'single') {
        jokeText = data.joke;
      } else {
        jokeText = `${data.setup}\n\n||${data.delivery}||`;
      }

      const embed = new EmbedBuilder()
        .setColor(COLORS.economy)
        .setTitle('😂 Random Joke')
        .setDescription(jokeText)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ embeds: [new EmbedBuilder().setColor(COLORS.error).setDescription('Failed to fetch a joke. Try again later.')] });
    }
  },
};
