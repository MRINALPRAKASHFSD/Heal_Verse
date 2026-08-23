import type { Logger as ApplicationLogger } from '@healverse/application';

export class ConsoleLogger implements ApplicationLogger {
  debug(message: string, meta?: Record<string, unknown>): void {
    console.debug(JSON.stringify({ level: 'debug', message, meta, timestamp: new Date().toISOString() }));
  }

  info(message: string, meta?: Record<string, unknown>): void {
    console.info(JSON.stringify({ level: 'info', message, meta, timestamp: new Date().toISOString() }));
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(JSON.stringify({ level: 'warn', message, meta, timestamp: new Date().toISOString() }));
  }

  error(message: string, meta?: Record<string, unknown>): void {
    console.error(JSON.stringify({ level: 'error', message, meta, timestamp: new Date().toISOString() }));
  }
}