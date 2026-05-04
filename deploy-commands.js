require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: "ping",
    description: "Ping command"
  },
  {
    name: "help",
    description: "Help command"
  },
  {
    name: "ban",
    description: "Ban a user",
    options: [
      {
        name: "user",
        type: 6,
        description: "User to ban",
        required: true
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );

  console.log("Commands registered");
})();
