const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

class DB {
  constructor() {
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    this.db = new Database(path.join(dataDir, 'aetherbot.db'));
    this.db.pragma('journal_mode = WAL');
    this.init();
    logger.success('Database initialized.');
  }

  init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS guilds (
        id TEXT PRIMARY KEY,
        welcome_channel TEXT,
        welcome_message TEXT DEFAULT 'Welcome {user} to **{server}**!',
        log_channel TEXT,
        mod_role TEXT,
        autorole TEXT
      );

      CREATE TABLE IF NOT EXISTS warnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        moderator_id TEXT NOT NULL,
        reason TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS economy (
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        balance INTEGER DEFAULT 0,
        last_daily INTEGER DEFAULT 0,
        last_work INTEGER DEFAULT 0,
        PRIMARY KEY (guild_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS custom_commands (
        guild_id TEXT NOT NULL,
        name TEXT NOT NULL,
        response TEXT NOT NULL,
        PRIMARY KEY (guild_id, name)
      );
    `);
  }

  ensureGuild(guildId) {
    this.db.prepare('INSERT OR IGNORE INTO guilds (id) VALUES (?)').run(guildId);
  }

  getGuild(guildId) {
    this.ensureGuild(guildId);
    return this.db.prepare('SELECT * FROM guilds WHERE id = ?').get(guildId);
  }

  setWelcome(guildId, channelId, message) {
    this.ensureGuild(guildId);
    this.db.prepare('UPDATE guilds SET welcome_channel = ?, welcome_message = ? WHERE id = ?').run(channelId, message, guildId);
  }

  setLogChannel(guildId, channelId) {
    this.ensureGuild(guildId);
    this.db.prepare('UPDATE guilds SET log_channel = ? WHERE id = ?').run(channelId, guildId);
  }

  setModRole(guildId, roleId) {
    this.ensureGuild(guildId);
    this.db.prepare('UPDATE guilds SET mod_role = ? WHERE id = ?').run(roleId, guildId);
  }

  setAutorole(guildId, roleId) {
    this.ensureGuild(guildId);
    this.db.prepare('UPDATE guilds SET autorole = ? WHERE id = ?').run(roleId, guildId);
  }

  addWarning(guildId, userId, moderatorId, reason) {
    return this.db.prepare(
      'INSERT INTO warnings (guild_id, user_id, moderator_id, reason, timestamp) VALUES (?, ?, ?, ?, ?)'
    ).run(guildId, userId, moderatorId, reason, Date.now());
  }

  getWarnings(guildId, userId) {
    return this.db.prepare('SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY timestamp DESC').all(guildId, userId);
  }

  clearWarnings(guildId, userId) {
    return this.db.prepare('DELETE FROM warnings WHERE guild_id = ? AND user_id = ?').run(guildId, userId);
  }

  getBalance(guildId, userId) {
    this.db.prepare('INSERT OR IGNORE INTO economy (guild_id, user_id) VALUES (?, ?)').run(guildId, userId);
    return this.db.prepare('SELECT * FROM economy WHERE guild_id = ? AND user_id = ?').get(guildId, userId);
  }

  addBalance(guildId, userId, amount) {
    this.db.prepare('INSERT OR IGNORE INTO economy (guild_id, user_id) VALUES (?, ?)').run(guildId, userId);
    this.db.prepare('UPDATE economy SET balance = balance + ? WHERE guild_id = ? AND user_id = ?').run(amount, guildId, userId);
  }

  setLastDaily(guildId, userId) {
    this.db.prepare('UPDATE economy SET last_daily = ? WHERE guild_id = ? AND user_id = ?').run(Date.now(), guildId, userId);
  }

  setLastWork(guildId, userId) {
    this.db.prepare('UPDATE economy SET last_work = ? WHERE guild_id = ? AND user_id = ?').run(Date.now(), guildId, userId);
  }

  getLeaderboard(guildId, limit = 10) {
    return this.db.prepare('SELECT * FROM economy WHERE guild_id = ? ORDER BY balance DESC LIMIT ?').all(guildId, limit);
  }

  transferBalance(guildId, fromId, toId, amount) {
    const transfer = this.db.transaction(() => {
      this.db.prepare('UPDATE economy SET balance = balance - ? WHERE guild_id = ? AND user_id = ?').run(amount, guildId, fromId);
      this.db.prepare('INSERT OR IGNORE INTO economy (guild_id, user_id) VALUES (?, ?)').run(guildId, toId);
      this.db.prepare('UPDATE economy SET balance = balance + ? WHERE guild_id = ? AND user_id = ?').run(amount, guildId, toId);
    });
    transfer();
  }

  addCustomCommand(guildId, name, response) {
    this.db.prepare('INSERT OR REPLACE INTO custom_commands (guild_id, name, response) VALUES (?, ?, ?)').run(guildId, name.toLowerCase(), response);
  }

  deleteCustomCommand(guildId, name) {
    return this.db.prepare('DELETE FROM custom_commands WHERE guild_id = ? AND name = ?').run(guildId, name.toLowerCase());
  }

  getCustomCommand(guildId, name) {
    return this.db.prepare('SELECT * FROM custom_commands WHERE guild_id = ? AND name = ?').get(guildId, name.toLowerCase());
  }

  listCustomCommands(guildId) {
    return this.db.prepare('SELECT * FROM custom_commands WHERE guild_id = ?').all(guildId);
  }
}

module.exports = DB;
