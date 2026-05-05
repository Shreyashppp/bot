const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DB {
  constructor() {
    const dir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.db = new Database(path.join(dir, 'aetherbot.db'));
    this.db.pragma('journal_mode = WAL');
    this.init();
  }

  init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS guilds (
        guild_id TEXT PRIMARY KEY,
        prefix TEXT DEFAULT '.',
        log_channel TEXT,
        mod_role TEXT,
        mute_role TEXT
      );

      CREATE TABLE IF NOT EXISTS warnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT, user_id TEXT, mod_id TEXT,
        reason TEXT, timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS automod (
        guild_id TEXT PRIMARY KEY,
        enabled INTEGER DEFAULT 0,
        bad_words INTEGER DEFAULT 0,
        spam INTEGER DEFAULT 0,
        links INTEGER DEFAULT 0,
        invites INTEGER DEFAULT 0,
        caps INTEGER DEFAULT 0,
        action TEXT DEFAULT 'warn',
        log_channel TEXT,
        whitelist_roles TEXT DEFAULT '[]',
        whitelist_channels TEXT DEFAULT '[]',
        bad_words_list TEXT DEFAULT '[]'
      );

      CREATE TABLE IF NOT EXISTS antinuke (
        guild_id TEXT PRIMARY KEY,
        enabled INTEGER DEFAULT 0,
        mass_ban INTEGER DEFAULT 1,
        mass_kick INTEGER DEFAULT 1,
        mass_channel_delete INTEGER DEFAULT 1,
        mass_role_delete INTEGER DEFAULT 1,
        bot_add INTEGER DEFAULT 1,
        webhook_create INTEGER DEFAULT 1,
        threshold INTEGER DEFAULT 3,
        action TEXT DEFAULT 'ban',
        log_channel TEXT
      );

      CREATE TABLE IF NOT EXISTS antinuke_whitelist (
        guild_id TEXT, user_id TEXT,
        PRIMARY KEY (guild_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS smartmod (
        guild_id TEXT PRIMARY KEY,
        enabled INTEGER DEFAULT 0,
        mute_at INTEGER DEFAULT 3,
        kick_at INTEGER DEFAULT 5,
        ban_at INTEGER DEFAULT 7,
        mute_duration INTEGER DEFAULT 3600
      );

      CREATE TABLE IF NOT EXISTS welcomer (
        guild_id TEXT PRIMARY KEY,
        welcome_enabled INTEGER DEFAULT 0,
        welcome_channel TEXT,
        welcome_message TEXT DEFAULT 'Welcome {user} to {server}!',
        welcome_embed INTEGER DEFAULT 1,
        leave_enabled INTEGER DEFAULT 0,
        leave_channel TEXT,
        leave_message TEXT DEFAULT 'Goodbye {user}, we will miss you!'
      );

      CREATE TABLE IF NOT EXISTS autoroles (
        guild_id TEXT, role_id TEXT, type TEXT DEFAULT 'all',
        PRIMARY KEY (guild_id, role_id)
      );

      CREATE TABLE IF NOT EXISTS selfrole_menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT, channel_id TEXT, message_id TEXT,
        title TEXT, description TEXT
      );

      CREATE TABLE IF NOT EXISTS selfrole_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_id INTEGER, role_id TEXT, label TEXT, emoji TEXT,
        FOREIGN KEY (menu_id) REFERENCES selfrole_menus(id)
      );

      CREATE TABLE IF NOT EXISTS jtc (
        guild_id TEXT PRIMARY KEY,
        hub_channel_id TEXT,
        category_id TEXT,
        name_template TEXT DEFAULT '{user}''s Channel'
      );

      CREATE TABLE IF NOT EXISTS jtc_channels (
        channel_id TEXT PRIMARY KEY,
        guild_id TEXT, owner_id TEXT
      );

      CREATE TABLE IF NOT EXISTS custom_commands (
        guild_id TEXT, name TEXT, response TEXT,
        PRIMARY KEY (guild_id, name)
      );

      CREATE TABLE IF NOT EXISTS snipe (
        channel_id TEXT PRIMARY KEY,
        guild_id TEXT, author_id TEXT, author_tag TEXT,
        content TEXT, timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS antinuke_actions (
        guild_id TEXT, user_id TEXT, action_type TEXT, timestamp INTEGER
      );
    `);
  }

  getGuild(guildId) {
    let g = this.db.prepare('SELECT * FROM guilds WHERE guild_id = ?').get(guildId);
    if (!g) {
      this.db.prepare('INSERT OR IGNORE INTO guilds (guild_id) VALUES (?)').run(guildId);
      g = this.db.prepare('SELECT * FROM guilds WHERE guild_id = ?').get(guildId);
    }
    return g;
  }

  setPrefix(guildId, prefix) {
    this.getGuild(guildId);
    this.db.prepare('UPDATE guilds SET prefix = ? WHERE guild_id = ?').run(prefix, guildId);
  }

  setLogChannel(guildId, channelId) {
    this.getGuild(guildId);
    this.db.prepare('UPDATE guilds SET log_channel = ? WHERE guild_id = ?').run(channelId, guildId);
  }

  setModRole(guildId, roleId) {
    this.getGuild(guildId);
    this.db.prepare('UPDATE guilds SET mod_role = ? WHERE guild_id = ?').run(roleId, guildId);
  }

  setMuteRole(guildId, roleId) {
    this.getGuild(guildId);
    this.db.prepare('UPDATE guilds SET mute_role = ? WHERE guild_id = ?').run(roleId, guildId);
  }

  addWarning(guildId, userId, modId, reason) {
    this.db.prepare('INSERT INTO warnings (guild_id, user_id, mod_id, reason, timestamp) VALUES (?, ?, ?, ?, ?)').run(guildId, userId, modId, reason, Date.now());
    return this.getWarnings(guildId, userId).length;
  }

  getWarnings(guildId, userId) {
    return this.db.prepare('SELECT * FROM warnings WHERE guild_id = ? AND user_id = ?').all(guildId, userId);
  }

  clearWarnings(guildId, userId) {
    this.db.prepare('DELETE FROM warnings WHERE guild_id = ? AND user_id = ?').run(guildId, userId);
  }

  deleteWarning(id) {
    this.db.prepare('DELETE FROM warnings WHERE id = ?').run(id);
  }

  getAutomod(guildId) {
    let a = this.db.prepare('SELECT * FROM automod WHERE guild_id = ?').get(guildId);
    if (!a) {
      this.db.prepare('INSERT OR IGNORE INTO automod (guild_id) VALUES (?)').run(guildId);
      a = this.db.prepare('SELECT * FROM automod WHERE guild_id = ?').get(guildId);
    }
    a.bad_words_list = JSON.parse(a.bad_words_list || '[]');
    a.whitelist_roles = JSON.parse(a.whitelist_roles || '[]');
    a.whitelist_channels = JSON.parse(a.whitelist_channels || '[]');
    return a;
  }

  setAutomod(guildId, field, value) {
    this.getAutomod(guildId);
    this.db.prepare(`UPDATE automod SET ${field} = ? WHERE guild_id = ?`).run(value, guildId);
  }

  addBadWord(guildId, word) {
    const a = this.getAutomod(guildId);
    if (!a.bad_words_list.includes(word)) {
      a.bad_words_list.push(word);
      this.db.prepare('UPDATE automod SET bad_words_list = ? WHERE guild_id = ?').run(JSON.stringify(a.bad_words_list), guildId);
    }
  }

  removeBadWord(guildId, word) {
    const a = this.getAutomod(guildId);
    const list = a.bad_words_list.filter(w => w !== word);
    this.db.prepare('UPDATE automod SET bad_words_list = ? WHERE guild_id = ?').run(JSON.stringify(list), guildId);
  }

  getAntinuke(guildId) {
    let a = this.db.prepare('SELECT * FROM antinuke WHERE guild_id = ?').get(guildId);
    if (!a) {
      this.db.prepare('INSERT OR IGNORE INTO antinuke (guild_id) VALUES (?)').run(guildId);
      a = this.db.prepare('SELECT * FROM antinuke WHERE guild_id = ?').get(guildId);
    }
    return a;
  }

  setAntinuke(guildId, field, value) {
    this.getAntinuke(guildId);
    this.db.prepare(`UPDATE antinuke SET ${field} = ? WHERE guild_id = ?`).run(value, guildId);
  }

  isAntinukeWhitelisted(guildId, userId) {
    return !!this.db.prepare('SELECT 1 FROM antinuke_whitelist WHERE guild_id = ? AND user_id = ?').get(guildId, userId);
  }

  addAntinukeWhitelist(guildId, userId) {
    this.db.prepare('INSERT OR IGNORE INTO antinuke_whitelist (guild_id, user_id) VALUES (?, ?)').run(guildId, userId);
  }

  removeAntinukeWhitelist(guildId, userId) {
    this.db.prepare('DELETE FROM antinuke_whitelist WHERE guild_id = ? AND user_id = ?').run(guildId, userId);
  }

  getAntinukeWhitelist(guildId) {
    return this.db.prepare('SELECT user_id FROM antinuke_whitelist WHERE guild_id = ?').all(guildId).map(r => r.user_id);
  }

  trackAntinukeAction(guildId, userId, actionType) {
    this.db.prepare('INSERT INTO antinuke_actions (guild_id, user_id, action_type, timestamp) VALUES (?, ?, ?, ?)').run(guildId, userId, actionType, Date.now());
  }

  getRecentAntinukeActions(guildId, userId, actionType, windowMs = 10000) {
    const since = Date.now() - windowMs;
    return this.db.prepare('SELECT COUNT(*) as count FROM antinuke_actions WHERE guild_id = ? AND user_id = ? AND action_type = ? AND timestamp > ?').get(guildId, userId, actionType, since).count;
  }

  getSmartmod(guildId) {
    let s = this.db.prepare('SELECT * FROM smartmod WHERE guild_id = ?').get(guildId);
    if (!s) {
      this.db.prepare('INSERT OR IGNORE INTO smartmod (guild_id) VALUES (?)').run(guildId);
      s = this.db.prepare('SELECT * FROM smartmod WHERE guild_id = ?').get(guildId);
    }
    return s;
  }

  setSmartmod(guildId, field, value) {
    this.getSmartmod(guildId);
    this.db.prepare(`UPDATE smartmod SET ${field} = ? WHERE guild_id = ?`).run(value, guildId);
  }

  getWelcomer(guildId) {
    let w = this.db.prepare('SELECT * FROM welcomer WHERE guild_id = ?').get(guildId);
    if (!w) {
      this.db.prepare('INSERT OR IGNORE INTO welcomer (guild_id) VALUES (?)').run(guildId);
      w = this.db.prepare('SELECT * FROM welcomer WHERE guild_id = ?').get(guildId);
    }
    return w;
  }

  setWelcomer(guildId, field, value) {
    this.getWelcomer(guildId);
    this.db.prepare(`UPDATE welcomer SET ${field} = ? WHERE guild_id = ?`).run(value, guildId);
  }

  getAutoroles(guildId) {
    return this.db.prepare('SELECT * FROM autoroles WHERE guild_id = ?').all(guildId);
  }

  addAutorole(guildId, roleId, type = 'all') {
    this.db.prepare('INSERT OR IGNORE INTO autoroles (guild_id, role_id, type) VALUES (?, ?, ?)').run(guildId, roleId, type);
  }

  removeAutorole(guildId, roleId) {
    this.db.prepare('DELETE FROM autoroles WHERE guild_id = ? AND role_id = ?').run(guildId, roleId);
  }

  getJTC(guildId) {
    return this.db.prepare('SELECT * FROM jtc WHERE guild_id = ?').get(guildId);
  }

  setJTC(guildId, hubChannelId, categoryId, nameTemplate) {
    this.db.prepare('INSERT OR REPLACE INTO jtc (guild_id, hub_channel_id, category_id, name_template) VALUES (?, ?, ?, ?)').run(guildId, hubChannelId, categoryId, nameTemplate);
  }

  removeJTC(guildId) {
    this.db.prepare('DELETE FROM jtc WHERE guild_id = ?').run(guildId);
  }

  addJTCChannel(channelId, guildId, ownerId) {
    this.db.prepare('INSERT OR IGNORE INTO jtc_channels (channel_id, guild_id, owner_id) VALUES (?, ?, ?)').run(channelId, guildId, ownerId);
  }

  getJTCChannel(channelId) {
    return this.db.prepare('SELECT * FROM jtc_channels WHERE channel_id = ?').get(channelId);
  }

  removeJTCChannel(channelId) {
    this.db.prepare('DELETE FROM jtc_channels WHERE channel_id = ?').run(channelId);
  }

  getCustomCommand(guildId, name) {
    return this.db.prepare('SELECT * FROM custom_commands WHERE guild_id = ? AND name = ?').get(guildId, name.toLowerCase());
  }

  addCustomCommand(guildId, name, response) {
    this.db.prepare('INSERT OR REPLACE INTO custom_commands (guild_id, name, response) VALUES (?, ?, ?)').run(guildId, name.toLowerCase(), response);
  }

  deleteCustomCommand(guildId, name) {
    this.db.prepare('DELETE FROM custom_commands WHERE guild_id = ? AND name = ?').run(guildId, name.toLowerCase());
  }

  listCustomCommands(guildId) {
    return this.db.prepare('SELECT * FROM custom_commands WHERE guild_id = ?').all(guildId);
  }

  setSnipe(channelId, guildId, authorId, authorTag, content) {
    this.db.prepare('INSERT OR REPLACE INTO snipe (channel_id, guild_id, author_id, author_tag, content, timestamp) VALUES (?, ?, ?, ?, ?, ?)').run(channelId, guildId, authorId, authorTag, content, Date.now());
  }

  getSnipe(channelId) {
    return this.db.prepare('SELECT * FROM snipe WHERE channel_id = ?').get(channelId);
  }

  createSelfroleMenu(guildId, channelId, messageId, title, description) {
    const result = this.db.prepare('INSERT INTO selfrole_menus (guild_id, channel_id, message_id, title, description) VALUES (?, ?, ?, ?, ?)').run(guildId, channelId, messageId, title, description);
    return result.lastInsertRowid;
  }

  updateSelfroleMenuMessage(menuId, messageId) {
    this.db.prepare('UPDATE selfrole_menus SET message_id = ? WHERE id = ?').run(messageId, menuId);
  }

  addSelfroleEntry(menuId, roleId, label, emoji) {
    this.db.prepare('INSERT INTO selfrole_entries (menu_id, role_id, label, emoji) VALUES (?, ?, ?, ?)').run(menuId, roleId, label, emoji || null);
  }

  getSelfroleMenu(menuId) {
    return this.db.prepare('SELECT * FROM selfrole_menus WHERE id = ?').get(menuId);
  }

  getSelfroleMenuByMessage(messageId) {
    return this.db.prepare('SELECT * FROM selfrole_menus WHERE message_id = ?').get(messageId);
  }

  getSelfroleEntries(menuId) {
    return this.db.prepare('SELECT * FROM selfrole_entries WHERE menu_id = ?').all(menuId);
  }

  getGuildSelfrolemenus(guildId) {
    return this.db.prepare('SELECT * FROM selfrole_menus WHERE guild_id = ?').all(guildId);
  }

  deleteSelfroleMenu(menuId) {
    this.db.prepare('DELETE FROM selfrole_entries WHERE menu_id = ?').run(menuId);
    this.db.prepare('DELETE FROM selfrole_menus WHERE id = ?').run(menuId);
  }
}

module.exports = DB;
