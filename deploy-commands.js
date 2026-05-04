require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: "ping",
    description: "Check bot"
  },
  {
    name: "help",
    description: "Show commands"
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
  },
  {
    name: "kick",
    description: "Kick a user",
    options: [
      {
        name: "user",
        type: 6,
        description: "User to kick",
        required: true
      }
    ]
  },
  {
    name: "mute",
    description: "Mute a user",
    options: [
      {
        name: "user",
        type: 6,
        description: "User to mute",
        required: true
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering commands...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID), // GLOBAL
      { body: commands }
    );

    console.log("Commands registered successfully ✅");
  } catch (error) {
    console.error(error);
  }
})();
