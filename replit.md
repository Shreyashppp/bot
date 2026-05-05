# Aetherbot — EDITH-Style Discord Bot

A full-featured Discord bot with both **prefix (`.`)** and **slash commands**, modeled after the EDITH bot.

## Features

**Main Menu:** Anti-Nuke, Auto Mod, Role Config, Moderation, Smart Moderation, Join to Create, No Prefix/Custom Commands

**Others Menu:** Other, Auto Role, Welcomer, Self Roles, Utility, Voice

## Commands (39 slash + prefix equivalents with aliases)

### 🔨 Moderation
`ban`, `kick`, `mute`, `unmute`, `warn`, `warnings`, `clearwarnings`, `delwarn`, `unban`, `softban`, `purge`, `lock`, `unlock`, `slowmode`, `nick`

### 🛡️ Anti-Nuke
`antinuke` (enable/disable/status/whitelist/settings) — protects against mass ban, mass kick, mass channel/role delete, bot add, webhook create

### 🤖 Auto Mod
`automod` (enable/disable/status/badword/spam/links/caps/invites/action/logchannel)

### 🧠 Smart Moderation
`smartmod` (enable/disable/status/set) — auto-punish based on warning thresholds (mute/kick/ban)

### ➕ Join to Create
`jtc` (setup/remove/status) + `voice` (rename/lock/unlock/limit/kick/claim)

### 👋 Welcomer
`welcome` (setchannel/setmessage/enable/disable/test) + `leave` (setchannel/setmessage/enable/disable)

### 🎭 Auto Role
`autorole` (add/remove/list)

### 🎀 Self Roles
`selfrole` (create/add/post/delete/list)

### ⚙️ Role Config
`role` (give/remove/create/delete/info/color/rename/all)

### ⚡ No Prefix / Custom Commands
`setprefix`, `addcmd`, `delcmd`, `listcmds`

### 🔧 Utility
`ping`, `serverinfo`, `userinfo`, `botinfo`, `avatar`, `snipe`, `setlog`, `help`

### ❓ Other
`uptime`, `invite`

## Project Structure

```
index.js                    — Entry point, initializes client + prefixCommands collection
deploy-commands.js          — Register slash commands with Discord API
src/
  handlers/
    commands.js             — Loads both slash (client.commands) and prefix (client.prefixCommands)
    events.js               — Loads all event files
  commands/
    antinuke/               — Anti-Nuke system
    automod/                — Auto-Mod system
    autorole/               — Auto Role
    jointocreate/           — Join to Create
    moderation/             — All mod commands
    noprefix/               — Custom commands + setprefix
    other/                  — Misc commands
    roleconfig/             — Role management
    selfroles/              — Self-assignable role menus
    smartmod/               — Smart Moderation
    utility/                — Help, ping, serverinfo, etc.
    voice/                  — Voice channel management
    welcomer/               — Welcome + leave messages
  events/
    ready.js                — Bot ready event
    interactionCreate.js    — Slash commands + button (self-roles)
    messageCreate.js        — Prefix command handler
    messageDelete.js        — Snipe + log
    messageUpdate.js        — Edit log
    guildMemberAdd.js       — Welcomer + Auto Role
    guildMemberRemove.js    — Leave messages
    voiceStateUpdate.js     — Join to Create
    guildBanAdd.js          — Ban log
    guildAuditLogEntryCreate.js — Anti-Nuke trigger
    antinuke.js             — Anti-Nuke core logic
    automodHandler.js       — Auto-Mod message scanner
  utils/
    database.js             — SQLite (better-sqlite3) with full schema
    embeds.js               — Embed builder helpers
    logger.js               — Colored console logger
data/                       — SQLite database (auto-created)
```

## Command Architecture

Every command file exports:
- `name` — command name (for prefix)
- `aliases` — alternate prefix names (optional)
- `data` — SlashCommandBuilder (for slash command registration)
- `execute(interaction, client)` — slash command handler
- `run(message, args, client)` — prefix command handler

## Environment Variables

| Variable         | Description                            |
|-----------------|----------------------------------------|
| `DISCORD_TOKEN`  | Bot token from Discord Developer Portal |
| `CLIENT_ID`      | Bot's Application/Client ID            |

## Deployment (Railway)

1. Push code to GitHub (`Shreyashppp/bot`, branch `main`)
2. Railway auto-deploys on push
3. Run `node deploy-commands.js` once to register slash commands globally
4. Start command: `node index.js`

## Tech Stack

- **Runtime**: Node.js 18+
- **Library**: discord.js v14
- **Database**: better-sqlite3 (SQLite)
- **Deployment**: Railway + GitHub
