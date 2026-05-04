# E.D.I.T.H-Style Professional Discord Bot
Production-ready Discord bot template focused on moderation and utility workflows, designed with clean slash-command architecture and interactive help UX.
## Features
- Professional slash command system (Discord API v10 / discord.js v14)
- Moderation commands with safety checks:
  - `/ban user [reason]`
  - `/kick user [reason]`
  - `/mute user [duration] [reason]`
  - `/purge amount`
- Utility commands:
  - `/ping`
  - `/help` (interactive category + command browser)
- Centralized startup and interaction error handling
- Guild or global command deployment script
## Setup
1. Install dependencies:
   - `npm install`
2. Create your environment file:
   - `cp .env.example .env`
3. Fill `.env`:
   - `DISCORD_TOKEN` = your bot token
   - `DISCORD_CLIENT_ID` = application client ID
   - `DISCORD_GUILD_ID` = optional test guild ID (recommended for fast updates)
4. Deploy slash commands:
   - `npm run deploy`
5. Start bot:
   - `npm start`
## Scripts
- `npm start` - run the bot
- `npm run deploy` - register slash commands
- `npm run check` - syntax-check all runtime files
## Notes
- Make sure the bot has required server permissions (Ban Members, Kick Members, Moderate Members, Manage Messages).
- Keep the bot role above the members it should moderate.
