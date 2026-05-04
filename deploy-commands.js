require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: "ping",
    description: "Check bot status"
  },
  {
    name: "help",
    description: "Show help menu"
  },
  {
    name: "ban",
    description: "Ban a user",
    options: [
      {
        name: "user",
        description: "User to ban",
        type: 6,
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
        description: "User to kick",
        type: 6,
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
        description: "User to mute",
        type: 6,
        required: true
      }
    ]
  },
  {
    name: "purge",
    description: "Delete multiple messages (1-100)",
    options: [
      {
        name: "amount",
        description: "Number of messages to delete",
        type: 4,
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

    console.log("All commands registered ✅");
  } catch (error) {
    console.error(error);
  }
})();
