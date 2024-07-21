export class TriniumLogger {
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.logLevel = game.settings.get('trinium-chat-buttons', 'logLevel');
  }

  log(level, message, ...args) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevel = levels.indexOf(this.logLevel);
    const messageLevel = levels.indexOf(level);

    if (messageLevel >= currentLevel) {
      console[level](`${this.moduleName} | ${message}`, ...args);
    }
  }

  info(message, ...args) {
    this.log('info', message, ...args);
  }

  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  error(message, ...args) {
    this.log('error', message, ...args);
  }

  debug(message, ...args) {
    this.log('debug', message, ...args);
  }
}
