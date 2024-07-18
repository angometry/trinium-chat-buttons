// Logger.js

export class TriniumLogger {
    constructor(moduleName) {
      this.moduleName = moduleName;
    }
  
    info(...args) {
      console.log(`${this.moduleName} |`, ...args);
    }
  
    warn(...args) {
      console.warn(`${this.moduleName} |`, ...args);
    }
  
    error(...args) {
      console.error(`${this.moduleName} |`, ...args);
    }
  
    debug(...args) {
      if (game.settings.get(this.moduleName, 'debug')) {
        console.debug(`${this.moduleName} |`, ...args);
      }
    }
  }