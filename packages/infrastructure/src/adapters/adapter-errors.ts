export class AdapterNotConfiguredError extends Error {
  constructor(adapterName: string, operation: string) {
    super(`${adapterName} is not configured for ${operation}.`);
    this.name = 'AdapterNotConfiguredError';
  }
}