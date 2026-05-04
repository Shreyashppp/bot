const commands = [
  {
    name: "ping",
    description: "Ping command"
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
