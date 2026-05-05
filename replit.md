# Aetherbot

A professional, all-in-one Discord bot built with discord.js v14.

## Features

- **Moderation**: ban, kick, mute, unmute, warn, warnings, clearwarnings, purge, unban
- **Music**: play, skip, stop, pause, resume, queue, nowplaying, loop, volume (YouTube via play-dl + @discordjs/voice)
- **Welcome Messages**: configurable welcome channel, message template, auto-role
- **Custom Commands**: server-specific slash command responses
- **Fun/Games**: 8ball, coinflip, dice, trivia, joke, meme
- **Role Management**: giverole, removerole, autorole (auto-assign on join)
- **Logging**: member join/leave, message delete/edit, bans logged to a configurable channel
- **Economy**: balance, daily, work, pay, leaderboard — stored in SQLite

## Project Structure

```
index.js               - Bot entry point
deploy-commands.js     - Register slash commands with Discord API
src/
  handlers/            - Command and event loaders
  commands/            - All slash commands organized by category
    moderation/
    music/
    fun/
    economy/
    roles/
    settings/
    utility/
  events/              - Discord event listeners
  utils/
    database.js        - better-sqlite3 database manager
    embeds.js          - Embed builder helpers
    logger.js          - Colored console logger
    musicManager.js    - Voice/audio queue manager
data/                  - SQLite database file (auto-created, gitignored)
Procfile               - Railway process configuration
railway.json           - Railway deployment config
.env.example           - Environment variable template
```

## Environment Variables

| Variable         | Description                          |
|-----------------|--------------------------------------|
| `DISCORD_TOKEN`  | Your bot token from Discord Dev Portal |
| `CLIENT_ID`      | Your bot's Application ID             |

## Deployment

### Railway (Recommended)
1. Push code to GitHub
2. Create new project on Railway, connect GitHub repo
3. Add `DISCORD_TOKEN` and `CLIENT_ID` as environment variables
4. Deploy — Railway runs `node index.js` automatically

### Running Locally
```bash
cp .env.example .env
# Fill in .env values
npm install
node deploy-commands.js   # Register slash commands once
node index.js             # Start the bot
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Library**: discord.js v14
- **Database**: better-sqlite3 (SQLite)
- **Music**: @discordjs/voice + play-dl
- **Deployment**: Railway + GitHub
