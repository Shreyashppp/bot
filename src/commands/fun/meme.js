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
    .setName('meme')
    .setDescription('Get a random meme from Reddit'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const data = await fetchJSON('https://meme-api.com/gimme');

      const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setTitle(data.title.slice(0, 256))
        .setURL(data.postLink)
        .setImage(data.url)
        .addFields(
          { name: '👍 Upvotes', value: `${data.ups}`, inline: true },
          { name: '📌 Subreddit', value: `r/${data.subreddit}`, inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ content: '❌ Could not fetch a meme. Try again later.' });
    }
  },
};
