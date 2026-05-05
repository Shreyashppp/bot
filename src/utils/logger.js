const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

const logger = {
  info: (...args) => console.log(`${colors.cyan}[${timestamp()}]${colors.reset} ${colors.green}[INFO]${colors.reset}`, ...args),
  warn: (...args) => console.warn(`${colors.cyan}[${timestamp()}]${colors.reset} ${colors.yellow}[WARN]${colors.reset}`, ...args),
  error: (...args) => console.error(`${colors.cyan}[${timestamp()}]${colors.reset} ${colors.red}[ERROR]${colors.reset}`, ...args),
  success: (...args) => console.log(`${colors.cyan}[${timestamp()}]${colors.reset} ${colors.bright}${colors.green}[OK]${colors.reset}`, ...args),
};

module.exports = logger;
