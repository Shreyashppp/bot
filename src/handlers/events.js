const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const registeredEvents = new Set();

async function loadEvents(client) {
  const eventsPath = path.join(__dirname, '../events');
  const files = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const event = require(path.join(eventsPath, file));

    // Only load files that export a proper event handler
    if (typeof event.execute !== 'function') continue;

    const name = event.eventName || file.replace('.js', '');

    // Never register the same event name twice
    if (registeredEvents.has(name)) {
      logger.warn(`[EVENTS] Skipping duplicate registration of event: ${name}`);
      continue;
    }
    registeredEvents.add(name);

    if (event.once) {
      client.once(name, (...args) => event.execute(...args, client));
    } else {
      client.on(name, (...args) => event.execute(...args, client));
    }

    logger.info(`Loaded event: ${name}`);
  }

  logger.info(`[EVENTS] Registered ${registeredEvents.size} events: ${[...registeredEvents].join(', ')}`);
}

module.exports = { loadEvents };
